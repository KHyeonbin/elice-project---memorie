import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { productService } from '../services';

// S3 라이브러리(이미지 업로드) 셋팅
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { memberService } from '../services';

const s3 = new S3Client({
  region: 'ap-northeast-2', // 지역(region) : Seoul
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID, // S3 액세스 키
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY, // S3 비밀 액세스 키
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME, // 버킷명
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`); // 파일명은 원본 파일명과 타임스탬프를 결합하여 설정
    },
  }),
});

const productRouter = Router();

// 상품등록 api (아래는 /product이지만, 실제로는 /products/product로 요청해야 함. ->app.js에 경로 설정할수있음 질문환영)
// 사진 이미지 S3에 업로드할 수 있게 미들웨어로 추가
productRouter.post('/product', upload.single('image-file'), async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const { name, category, manufacturer, description, price } = req.body;
    // req.file.location에서 이미지 링크 가져오기
    const imageUrl = req.file.location;

    // 위 데이터를 유저 db에 추가하기(서비스 품목에 상품등록 서비스를 이용함)
    const newProduct = await productService.addProduct({
      name,
      category,
      manufacturer,
      description,
      price,
      imageUrl,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

//상품조회 api
productRouter.get('/productlist', async (req, res, next) => {
  try {
    const productInfo = await productService.getProducts();

    res.status(200).json(productInfo);
  } catch (error) {
    next(error);
  }
});

//홈 옵션에 해당하는거 가져오는 api
productRouter.get('/homefragrance', async (req, res, next) => {
  try {
    const categoryId = '63db888be265dbf211224f0d';
    const products = await productService.getProductsByCategory(categoryId);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});
//handcare 옵션 해당하는 제품 가져오는 api
productRouter.get('/handcare', async (req, res, next) => {
  try {
    const categoryId = '6350f7a1a6b9ed0063334298';
    const products = await productService.getProductsByCategory(categoryId);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//bodycare 옵션 해당하는 제품 가져오는 api
productRouter.get('/bodycare', async (req, res, next) => {
  try {
    const categoryId = '63d9bf9e7c2b56552fca0aa6';
    const products = await productService.getProductsByCategory(categoryId);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//perfume 옵션 해당하는 제품 가져오는 api
productRouter.get('/perfume', async (req, res, next) => {
  try {
    const categoryId = '6350a6e5d6120b67050df0dd';
    const products = await productService.getProductsByCategory(categoryId);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//특정상품조회
productRouter.get('/product/:productId', async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productInfo = await productService.getProductById(productId);

    res.status(200).json(productInfo);
  } catch (error) {
    next(error);
  }
});

//상품 내용 수정
productRouter.patch('/amend/:productId', upload.single('image-file'), async function (req, res, next) {
  try {
    // params로부터 id를 가져옴
    const productId = req.params.productId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const name = req.body.name;
    const category = req.body.category;
    const manufacturer = req.body.manufacturer;
    const description = req.body.description;
    const price = req.body.price;

    const imageUrl = req.file ? req.file.location : null;

    const productInfoRequired = { productId };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(name && { name }),
      ...(category && { category }),
      ...(manufacturer && { manufacturer }),
      ...(description && { description }),
      ...(imageUrl && { imageUrl }),
      ...(price && { price }),
    };

    // 사용자 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(productInfoRequired, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);
  } catch (error) {
    next(error);
  }
});

// 선택한 상품을 DB에서 제거하는 api
productRouter.delete('/productlist', async (req, res, next) => {
  const { selectedIds } = req.body; // 배열 형태로 id가 들어옴

  if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
    return res.status(400).json({ reason: '이미 존재하지 않는 상품을 삭제하려고 시도했습니다. 다시 확인해주세요.' });
  }

  try {
    // productService로 삭제 이벤트 위임
    await productService.deleteProductsById(selectedIds);
    res.json({ success: true, message: '선택된 상품을 제거 완료했습니다.' });
  } catch (error) {
    next(error);
  }
});

export { productRouter };
