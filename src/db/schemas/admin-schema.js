import { Schema } from 'mongoose';

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
