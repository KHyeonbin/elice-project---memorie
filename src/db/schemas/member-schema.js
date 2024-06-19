import { Schema } from 'mongoose';

// 사용자/관리자 공통적으로 로그인 시 필요한 필드 : email, password, isUser
const MemberSchema = new Schema(
  {
    kakaoId: {
      type: String,
      unique: true,
      sparse: true,
    },
    naverId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
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
      required: false,
    },
    isUser: {
      type: Boolean,
      default: true,
      required: true,
    },
    provider: {
      type: String,
      required: false,
    },
  },
  {
    collection: 'member',
    timestamps: true,
  },
);

export { MemberSchema };
