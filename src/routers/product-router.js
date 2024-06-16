import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { productService } from '../services/product-service';

const productRouter = Router();

// 상품등록 api (아래는 /product이지만, 실제로는 /products/product로 요청해야 함. ->app.js에 경로 설정할수있음 질문환영)
productRouter.post('/product', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기 (여기부터 본 내용)
    const name = req.body.name;
    const category = req.body.category;
    const manufacturer = req.body.manufacturer;
    const description = req.body.description;
    const price = req.body.price;
    const imageFile = req.body.imageFile;

    // 위 데이터를 유저 db에 추가하기(서비스 품목에 상품등록 서비스를 이용함)
    const newProduct = await productService.addProduct({
      name,
      category,
      manufacturer,
      description,
      price,
      imageFile,
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
