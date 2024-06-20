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

  async addOrder(orderInfo) {
    // 객체 destructuring(아직 정리안된코드.. )
    const { name, address, number, price } = orderInfo;

    const newOrderInfo = { name, address, number, price };

    // db에 저장
    const createdNewOrder = await this.orderModel.create(newOrderInfo);

    return createdNewOrder;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
