import { productModel } from '../db';

class ProductService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨(엘리스설명)
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품등록 서비스 - 모델에 create 부품을 사용해서 데이터베이스에 새롭게 추가해줘
  async addProduct(productInfo) {
    // 객체 destructuring(아직 정리안된코드.. 한줄로 합쳐도 될것같은데)
    const { title, category, manufacturer, description, price, imageFile } = productInfo;

    const newProductInfo = { title, category, manufacturer, description, price, imageFile };

    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);

    return createdNewProduct;
  }

  // 사용자 목록조회 서비스 - 모델에 findAll 부품을 사용해서 데이터베이스에 모든정보를 가져다줘
  async getProducts() {
    const products = await this.productModel.findAll();
    return products;
  }

  async getProductById(productId) {
    const product = await this.productModel.findById(productId);
    return product;
  }
}

const productService = new ProductService(productModel);

export { productService };
