// order-router.js
import { Router } from 'express';
import { orderService } from '../services/order-service';

const orderRouter = Router();

orderRouter.post('/order', async (req, res, next) => {
  try {
    // req (request)의 body 에서 데이터 가져오기
    const { name, number, address, price } = req.body;

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.addOrder({
      name,
      number,
      address,
      price,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

orderRouter.get('/orderlist', async (req, res, next) => {
  try {
    // 전체 주문 목록을 얻음
    const orders = await orderService.getOrders();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// PUT /orders/:orderId
orderRouter.put('/:orderId', async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
