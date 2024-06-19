import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/kakao', passport.authenticate('kakao'));

authRouter.get(
  '/kakao/callback',
  // passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate('kakao', {
    failureRedirect: '/', // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  (req, res) => {
    res.redirect('/');
  },
);

authRouter.get(
  '/naver',
  passport.authenticate('naver', {
    authType: 'reprompt',
  }),
);

authRouter.get(
  '/naver/callback',
  // passport 로그인 전략에 의해 naverStrategy로 가서 네이버계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate('naver', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  },
);

export { authRouter };
