import express from 'express';
import Product from '../models/Product';

const router = express.Router();

router.post('/upload-product', async (req, res) => {
  try {
    const { title, category, manufacturer, shortDescription, detailDescription, inventory, price, searchKeyword } =
      req.body;
    const keywords = searchKeyword.split(',');

    const product = new Product({
      name: title,
      category,
      manufacturer,
      shortDescription,
      detailDescription,
      imageUrl: '', // 이미지 URL을 나중에 추가
      inventory,
      price,
      keywords,
    });

    await product.save();
    res.status(201).json({ message: 'Product uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading product', error });
  }
});

// 제품 목록을 가져오는 엔드포인트 추가
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

export default router;
