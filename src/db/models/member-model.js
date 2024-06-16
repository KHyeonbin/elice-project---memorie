import { model } from 'mongoose';
import { MemberSchema } from '../schemas/member-schema';

const Member = model('member', MemberSchema);

export class MemberModel {
  /** email 기준 멤버 하나 가져오기 */
  async findByEmail(email) {
    const member = await Member.findOne({ email });
    return member;
  }

  /** _id 기준 멤버 하나 가져오기 */
  async findById(memberId) {
    const member = await Member.findOne({ _id: memberId });
    return member;
  }

  /** 입력한 member 정보로 DB 데이터 생성 */
  async create(memberInfo) {
    const createdNewMember = await Member.create(memberInfo);
    return createdNewMember;
  }

  /** (미완성/ 사용자만 사용하게) 사용자인 멤버만 가져오기 */
  async findUserAll() {
    const users = await Member.find({ isUser: true });
    return users;
  }

  /** 미완성 */
  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }
}

const memberModel = new MemberModel();

export { memberModel };
