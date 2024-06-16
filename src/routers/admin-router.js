import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { userService, adminService } from '../services';
import { memberService } from '../services/member-service';

const adminRouter = Router();

adminRouter.get('/users-info', loginRequired, async (req, res, next) => {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();
    console.log(users);
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/login', async (req, res, next) => {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request) 에서 데이터 가져오기
    const id = req.body.id;
    const password = req.body.password;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const adminToken = await adminService.getAdminToken({ id, password });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(adminToken);
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/register', async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const { isUser, fullName, email, password } = req.body;

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

export { adminRouter };
