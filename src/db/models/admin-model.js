import { model } from 'mongoose';
import { AdminSchema } from '../schemas/admin-schema';

const Admin = model('admin', AdminSchema);

export class AdminModel {
  async findById(adminId) {
    const admin = await Admin.findOne({ _id: adminId });
    return admin;
  }
}

const AdminModel = new AdminModel();

export { AdminModel };
