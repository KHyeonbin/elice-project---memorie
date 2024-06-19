import { orderModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  // 사용자 목록을 받음.
  async getOrderById(orderId) {
    const order = await this.orderModel.findById(orderId);
    return order;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
