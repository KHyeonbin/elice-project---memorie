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

  /** 사용자인 멤버만 가져오기 */
  async findUserAll() {
    const users = await Member.find({ isUser: true });
    return users;
  }

  /** 기존 이메일 기반 새로운 이름과 이메일로 수정 */
  async update(prevMemberEmail, newName, newEmail) {
    const filter = { email: prevMemberEmail };
    const update = { name: newName, email: newEmail };
    const option = { returnOriginal: false };

    const updatedUser = await Member.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  async delete(memberEmail) {
    try {
      await Member.findOneAndDelete({ email: memberEmail });
      return;
    } catch (error) {
      console.error('DB 삭제 실패', error);
      throw error;
    }
  }

  /** 카카오 사용자 정보 조회 */
  async findByKakaoId(kakaoId) {
    const member = await Member.findOne({ kakaoId });
    return member;
  }

  /** 사용자 정보 추가 (카카오) */
  async createByKakao(memberInfo) {
    const createdNewMember = await Member.create(memberInfo);
    return createdNewMember;
  }

  /** 네이버 사용자 정보 조회 */
  async findByNaverId(naverId) {
    const member = await Member.findOne({ naverId });
    return member;
  }

  /** 사용자 정보 추가 (네이버) */
  async createByNaver(memberInfo) {
    const createdNewMember = await Member.create(memberInfo);
    return createdNewMember;
  }
  //전체유저조회
  async findAll() {
    const members = await Member.find({});
    return members;
  }
}

const memberModel = new MemberModel();

export { memberModel };
