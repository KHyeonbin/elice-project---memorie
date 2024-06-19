import { Schema } from 'mongoose';

// 주문 스키마 정의
const OrderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    /*address: {
        type: new Schema(
          {
            postalCode: String,
            address1: String,
            address2: String,
          },
          {
            _id: false,
          },
        ),
        required: true,
      },*/
    status: {
      type: String,
      enum: ['주문접수', '배송중', '배송완료'],
      default: '주문접수',
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  },
);

export { OrderSchema };
