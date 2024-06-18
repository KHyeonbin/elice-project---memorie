import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { productService } from '../services/product-service';

// S3 라이브러리(이미지 업로드) 셋팅
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

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

export { productRouter };

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
