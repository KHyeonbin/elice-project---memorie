import cors from 'cors';
import express from 'express';
import { orderRouter, viewsRouter, userRouter, adminRouter, productRouter, searchRouter } from './routers';
import { errorHandler } from './middlewares';

//추가한 부분 8-11
const path = require('path');
require('dotenv').config();

const app = express();

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// views 라우팅
app.use(viewsRouter);

// search 라우팅
app.use('/search', searchRouter);

app.use('/orders', orderRouter);

// users 라우팅
app.use('/users', userRouter);

//products 라우팅
app.use('/products', productRouter);

// admin 라우팅
app.use('/admin', adminRouter);

// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

app.get('/homefragrance', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'homefragrance', 'homefragrance.html'));
});

export { app };
