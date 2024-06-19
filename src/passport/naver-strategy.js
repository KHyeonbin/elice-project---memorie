import passport from 'passport';
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver-v2';
import { memberService } from '../services';

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: '/users/auth/naver/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 네이버 플랫폼에서 로그인 했고 & snsId 필드에 네이버 아이디가 일치할 경우
        const existingUser = await memberService.getMemberByNaverId(profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }

        // 가입되지 않은 유저면 회원가입 시키고 로그인을 시킨다
        const newUser = await memberService.addMemberByNaver({
          naverId: profile.id,
          email: profile.email,
          name: profile.name,
          provider: 'naver',
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
