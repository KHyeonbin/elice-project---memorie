import { Schema } from 'mongoose';

const AdminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      required: false,
      default: 'admin',
    },
  },
  {
    collection: 'admin',
    timestamps: true,
  },
);

export { AdminSchema };
