import { memberModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

  // 로그인
  async getMemberToken(loginInfo) {
    const { isUser, email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const member = await this.memberModel.findByEmail(email);
    if (!member) {
      throw new Error('해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = member.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ memberId: member._id, isUser }, secretKey);

    return { token };
  }

  // 단일 member 데이터 조회
  async getMemberByEmail(memberEmail) {
    const member = await this.memberModel.findByEmail(memberEmail);
    return member;
  }
}

const memberService = new MemberService(memberModel);

export { memberService };
