import { adminModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AdminService {
  constructor(adminModel) {
    this.adminModel = adminModel;
  }

  // 로그인
  async getAdminToken(loginInfo) {
    // 객체 destructuring
    const { name, password } = loginInfo;

    const admin = await this.adminModel.findByName(name);
    if (!admin) {
      throw new Error('해당 이름은 존재하지 않습니다. 다시 확인해 주세요.');
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = admin.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ adminId: admin._id, role: 'admin' }, secretKey);

    return { token };
  }

  async getAdminById(adminName) {
    const admin = await this.adminModel.findById(adminName);
    return admin;
  }
}

const adminService = new AdminService(adminModel);

export { adminService };
