import { Router } from 'express';
// import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
// import { productService } from '../services';

const searchRouter = Router();

// 검색 결과 불러오는 api
searchRouter.get('/search', async (req, res, next) => {
  console.log(req.query.val);
  // 컬렉션에 접근해서 DB 정보 find 로 가져와
});

export { searchRouter };
