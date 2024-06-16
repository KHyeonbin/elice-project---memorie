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
