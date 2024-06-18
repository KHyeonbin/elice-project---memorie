import { Router } from 'express';
import { productService } from '../services';

const searchRouter = Router();

// 검색 결과 불러오는 api
searchRouter.get('/', async (req, res, next) => {
  try {
    const searchStr = decodeURIComponent(req.query.val);
    if (!searchStr) {
      return res.status(400).json({ message: '잘못된 요청: 검색어가 입력되지 않았습니다.' });
    }

    // 상품명에 검색어가 포함된 항목을 배열로 가져오기
    const filteredProducts = await productService.getFilteredProductsByName(searchStr);
    if (!filteredProducts || filteredProducts.length === 0) {
      return res.status(404).json({ message: '검색 결과가 없습니다.' });
    }

    res.status(200).json(filteredProducts);
  } catch (error) {
    next(error);
  }
});

export { searchRouter };
