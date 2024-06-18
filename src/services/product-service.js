import { productModel } from '../db';

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async addProduct(productInfo) {
    // 객체 destructuring(아직 정리안된코드.. )
    const { name, category, manufacturer, description, price, imageUrl } = productInfo;

    const newProductInfo = { name, category, manufacturer, description, price, imageUrl };

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

  // 제품명에 검색어가 포함된 제품들만 가져오기
  async getFilteredProductsByName(productKeyword) {
    const products = await this.productModel.findByName(productKeyword);
    return products;
  }
  
  async getProductsByCategory(categoryId) {
    return await productModel.findByCategory(categoryId);
  }
}

const productService = new ProductService(productModel);

export { productService };
