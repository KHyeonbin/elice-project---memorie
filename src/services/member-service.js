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

  // 카카오 사용자 정보 조회
  async getMemberByKakaoId(kakaoId) {
    const member = await this.memberModel.findByKakaoId(kakaoId);
    return member;
  }

  // 사용자 정보 추가 (카카오)
  async addMemberByKakao(memberInfo) {
    const { kakaoId, email, name, password } = memberInfo;
    const newMemberInfo = { kakaoId, email, name, password: password ? await bcrypt.hash(password, 10) : null };
    const createdNewMember = await this.memberModel.createByKakao(newMemberInfo);
    return createdNewMember;
  }

  // 네이버 사용자 정보 조회
  async getMemberByNaverId(naverId) {
    const member = await this.memberModel.findByNaverId(naverId);
    return member;
  }

  // 사용자 정보 추가 (네이버)
  async addMemberByNaver(memberInfo) {
    const { naverId, email, name, provider } = memberInfo;
    const newMemberInfo = { naverId, email, name, provider };
    const createdNewMember = await this.memberModel.createByNaver(newMemberInfo);
    return createdNewMember;
  }
}

const memberService = new MemberService(memberModel);

export { memberService };
