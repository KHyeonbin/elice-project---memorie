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

  // 이름에 검색어가 포함된 제품만 찾는 모델
  async findByName(productKeyword) {
    const products = await Product.find({ name: new RegExp(productKeyword, 'gi') });
    return products;
  }

  async findById(productId) {
    const product = await Product.findOne({ _id: productId });
    return product;
  }

  //수정하는 모델
  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedProduct = await Product.findOneAndUpdate(filter, update, option);
    return updatedProduct;
  }
  //특정 카테고리만 찾아오기
  async findByCategory(categoryId) {
    const products = await Product.find({ category: categoryId });
    return products;
  }

  // 선택된 상품 모두 제거
  async deleteByIdArr(productIdArr) {
    await Product.deleteMany({ _id: { $in: productIdArr } });
    return;
  }
}

const productModel = new ProductModel();

export { productModel };
