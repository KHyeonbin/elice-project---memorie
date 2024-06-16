//백엔드 + 프론트엔드 상품등록 프로세스
//(각항목 수정하면 app.js와 db폴더의 index, 라우터폴더의index, 서비스폴더의 index수정하기)

// 백엔드
//고객의 요청을 라우터(홀직원)이 post인지? get인지? 확인해서 서비스(요리사)에게 넘기면
//서비스(요리사)는 스키마(식자재)로 구성되어있는 모델(레시피)를 참조해서 처리를 함

//데이터베이스(스키마, 모델)
// 스키마 : 상품에 대한 각 정보들 (이름, 가격, 제조사, 수량 등등)                                                        ex) 식자재 원재료
// 모 델  :  DB의 CRUD?, 추가하고 찾고 수정하고 지우는 부품들을 정리해둔 곳                                               ex) 요리 레시피

//컨트롤러(라우터, 서비스 + 미들웨어는 필요한 곳에만 가져다 쓰기 로그인 또는 관리자 등)
// 서비스 : 라우터에서 넘어온 정보를 하위 모델을 이용해서 처리하는 중간 역할                                                ex) 요리사
// 라우터 : 해당 경로('/product')에 post 요청이 들어왔을때 productRouter을 이용해서 처리해줘(프론트에서 백으로 들어가는 문)  ex)홀 직원

////  데이터베이스 부분   ///////////////
////////      스키마 구성      /////////
import { Schema } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: false,
  },
});

export { ProductSchema };

////////////     모델 구성       /////////
import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';
// 변수product 에 product스키마를 기반으로 products라는 이름의 모델을 생성할거야model('이름', 기반)
const Product = model('products', ProductSchema);

//여러가지 모델들을 정의해둔다.
export class ProductModel {
  //생성하는 모델
  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }
  //전체를 찾는 모델
  async findAll() {
    const products = await Product.find({});
    return products;
  }
  //수정하는 모델
  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(filter, update, option);
    return updatedProduct;
  }
}

const productModel = new ProductModel();

export { productModel };

//   컨트롤러 부분   ///////////////////////////

///////////    서비스 구성    //////////////
import { productModel } from '../db';

class ProductService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨(엘리스설명)
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품등록 서비스 - 모델에 create 부품을 사용해서 데이터베이스에 새롭게 추가해줘
  async addProduct(productInfo) {
    // 객체 destructuring(아직 정리안된코드.. 한줄로 합쳐도 될것같은데)
    const { name, price, manufacturer } = productInfo;

    const newProductInfo = { name, price, manufacturer };

    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);

    return createdNewProduct;
  }

  // 사용자 목록조회 서비스 - 모델에 findAll 부품을 사용해서 데이터베이스에 모든정보를 가져다줘
  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }
}

const productService = new ProductService(productModel);

export { productService };

////////////      라우터 구성     ///////////
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
    const price = req.body.price;
    const manufacturer = req.body.manufacturer;

    // 위 데이터를 유저 db에 추가하기(서비스 품목에 상품등록 서비스를 이용함)
    const newProduct = await productService.addProduct({
      name,
      price,
      manufacturer,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

export { productRouter };

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////            프론트 product.js               /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

import * as Api from '/api.js';

// 요소(element), input 혹은 상수 (HTML의 폼 입력요소 변수에 할당)
const nameInput = document.querySelector('#nameInput');
const priceInput = document.querySelector('#priceInput');
const manufacturerInput = document.querySelector('#manufacturerInput');
const submitButton = document.querySelector('#submitButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

// 상품등록 진행
async function handleSubmit(e) {
  e.preventDefault();

  const name = nameInput.value;
  const category = categoryInput.value;
  const manufacturer = manufacturerInput.value;
  const description = descriptionInput.value;
  const imageUrl = imageUrlInput.value;
  const price = priceInput.value;

  // 잘 입력했는지 확인
  const isNameValid = name.length >= 2;
  const isManufacturerValid = manufacturer.length >= 4;

  if (!isNameValid || !isManufacturerValid) {
    return alert('이름은 2글자 이상, 제조사는 4글자 이상이어야 합니다.');
  }

  // 상품등록 api 요청
  try {
    const data = { name, price, manufacturer };

    await Api.post('/products/product', data);

    alert(`정상적으로 등록되었습니다.`);

    // 홈 이동 (-> 마이페이지로 가는게 나을듯)
    window.location.href = '/';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
