import passport from 'passport';
import KakaoStrategy from 'passport-kakao';
import { memberService } from '../services';

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: '/users/auth/kakao/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // profile.id를 이용해 사용자 정보를 DB에서 조회합니다.
        const existingUser = await memberService.getMemberByKakaoId(profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }

        // 사용자가 없으면 새 사용자로 가입시킵니다.
        const newUser = await memberService.addMemberByKakao({
          kakaoId: profile.id,
          email: profile._json && profile._json.kakao_account.email,
          name: profile.displayName,
          // 추가적으로 필요한 정보가 있다면 설정합니다.
        });
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await memberService.getMemberById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
