import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';
const Product = model('products', ProductSchema);

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
