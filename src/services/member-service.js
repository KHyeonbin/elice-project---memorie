import { memberModel } from '../db';

import bcrypt from 'bcrypt';

class MemberService {
  constructor(memberModel) {
    this.memberModel = memberModel;
  }

  // 회원가입
  async addMember(memberInfo) {
    const { isUser, fullName, email, password } = memberInfo;

    // 이메일 중복 확인
    const member = await this.memberModel.findByEmail(email);
    if (member) {
      throw new Error('이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.');
    }

    // 이메일 중복은 이제 아니므로, 회원가입을 진행함

    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newMemberInfo = { isUser, fullName, email, password: hashedPassword };

    // db에 저장
    const createdNewMember = await this.memberModel.create(newMemberInfo);

    return createdNewMember;
  }

  // 이메일로 사용자 정보 찾기
  async getMemberByEmail(memberEmail) {
    const member = await this.memberModel.findByEmail(memberEmail);
    return member;
  }

  // 사용자 ID로 사용자 정보 찾기
  async getMemberById(memberId) {
    const member = await this.memberModel.findById(memberId);
    return member;
  }
}

const memberService = new MemberService(memberModel);

export { memberService };
