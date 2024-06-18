import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { memberService } from '../services';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import MongoStore from 'connect-mongo';

const adminRouter = Router();

// passport 라이브러리 셋팅
adminRouter.use(passport.initialize());
adminRouter.use(
  session({
    secret: process.env.SESSION_SECRET, // 세션 id를 암호화
    resave: false, // 요청 이벤트마다 사용자의 session을 갱신할 지 여부
    saveUninitialized: false, // 비로그인 시에도 세션 생성해줄 지 여부
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // maxAge: [ms] => 세션 만료 기한 설정
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      dbName: 'test',
    }),
  }),
);
adminRouter.use(passport.session());

// 회원가입이 되었는 지 확인하고 세션 발행
passport.use(
  // passport 라이브러리가 usernameField를 쓰도록 강제하고 있음.
  // 그래서, adminnameField 대신 usernameField라고 적고, 그 밑의 코드에서 admin으로 수정함
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, cb) => {
    try {
      // 해당 이메일의 관리자 정보가 db에 존재하는지 확인
      const admin = await memberService.getMemberByEmail(email);
      if (!admin) {
        return cb(null, false, { message: '이메일이 틀렸습니다.' });
      }

      // 비밀번호 일치 여부 확인
      const correctPasswordHash = admin.password; // db에 저장되어 있는 암호화된 비밀번호
      const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);

      if (isPasswordCorrect) {
        return cb(null, admin);
      } else {
        return cb(null, false, { message: '비밀번호가 틀렸습니다.' });
      }
    } catch (err) {
      console.error(err);
      return cb(err);
    }
  }),
);

passport.serializeUser((admin, done) => {
  const { _id, email, isUser } = admin;
  process.nextTick(() => {
    done(null, { id: _id, email, isUser });
  });
});

passport.deserializeUser(async (admin, done) => {
  // 항상 최신의 DB 기반 member 정보 보장
  const refreshedAdmin = await memberService.getMemberById(admin.id);
  delete refreshedAdmin.password;

  process.nextTick(() => {
    done(null, refreshedAdmin);
  });
});

// 회원가입 api
adminRouter.post('/register', async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const { isUser, fullName, email, password, adminSecretKey } = req.body;

    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new Error('관리자 접근키가 틀렸습니다. 내부 관리자에게 문의하세요.');
    }

    // 위 데이터를 유저 db에 추가하기
    const newMember = await memberService.addMember({
      isUser,
      fullName,
      email,
      password,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newMember);
  } catch (error) {
    next(error);
  }
});

// 로그인 api
adminRouter.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, admin, info) => {
    if (err) return res.status(500).json(err);
    if (!admin) return res.status(401).json({ message: info.message });

    req.logIn(admin, (err) => {
      if (err) return next(err);
      res.status(200).json(admin); // 로그인 성공 시 admin 정보 반환
    });
  })(req, res, next);
});

export { adminRouter };
