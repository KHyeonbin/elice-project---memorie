import { Router } from 'express';
import is from '@sindresorhus/is';
import { loginRequired } from '../middlewares';
import { memberService } from '../services';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import MongoStore from 'connect-mongo';
import { authRouter } from './auth-router';
import '../passport/kakao-strategy';
import '../passport/naver-strategy';

const userRouter = Router();

// passport 라이브러리 셋팅
userRouter.use(passport.initialize());
userRouter.use(
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
userRouter.use(passport.session());

// auth 라우팅
userRouter.use('/auth', authRouter);

// 회원가입이 되었는 지 확인하고 세션 발행
passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, cb) => {
    try {
      // 해당 이메일의 사용자 정보가 db에 존재하는지 확인
      const user = await memberService.getMemberByEmail(email);
      if (!user) {
        return cb(null, false, { message: '이메일이 틀렸습니다.' });
      }

      // 비밀번호 일치 여부 확인
      const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호
      const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);

      if (isPasswordCorrect) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: '비밀번호가 틀렸습니다.' });
      }
    } catch (err) {
      console.error(err);
      return cb(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  const { _id, email, isUser } = user;
  process.nextTick(() => {
    done(null, { id: _id, email, isUser });
  });
});

passport.deserializeUser(async (user, done) => {
  // 항상 최신의 DB 기반 member 정보 보장
  const refreshedUser = await memberService.getMemberById(user.id);
  delete refreshedUser.password;

  process.nextTick(() => {
    done(null, refreshedUser);
  });
});

// 회원가입 api
userRouter.post('/register', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const { isUser, fullName, email, password } = req.body;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await memberService.addMember({
      isUser,
      fullName,
      email,
      password,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 로그인 api
userRouter.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json(user); // 로그인 성공 시 user 정보 반환
    });
  })(req, res, next);
});

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get('/memberlist', async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const members = await memberService.getMembers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch('/users/:userId', loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const userId = req.params.userId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const fullName = req.body.fullName;
    const password = req.body.password;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;
    const role = req.body.role;

    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
    const currentPassword = req.body.currentPassword;

    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { userId, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(fullName && { fullName }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
      ...(role && { role }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(userInfoRequired, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/mypage', loginRequired, async (req, res, next) => {
  try {
    const userInfo = await userService.getUserById(userId);

    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
});

export { userRouter };
