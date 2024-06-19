import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('order', OrderSchema);

export class OrderModel {
  async findById(orderId) {
    const order = await Order.findOne({ _id: orderId });
    return order;
  }
}

const orderModel = new OrderModel();

export { orderModel };
