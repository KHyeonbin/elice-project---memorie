import express from 'express';
import path from 'path';

const viewsRouter = express.Router();

// 페이지별로 html, css, js 파일들을 라우팅함
// 아래와 같이 하면, http://localhost:5000/ 에서는 views/home/home.html 파일을,
// http://localhost:5000/register 에서는 views/register/register.html 파일을 화면에 띄움
viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/users/mypage', serveStatic('mypage')); // mypage.html과 연동
viewsRouter.use('/admin', serveStatic('admin'));
viewsRouter.use('/productadd', serveStatic('productadd'));
viewsRouter.use('/productlist', serveStatic('productlist'));
viewsRouter.use('/product-update', serveStatic('product-update'));
viewsRouter.use('/product-single', serveStatic('product-single'));
viewsRouter.use('/single-item', serveStatic('single-item'));
viewsRouter.use('/about', serveStatic('about'));
viewsRouter.use('/userlists', serveStatic('userlists'));
viewsRouter.use('/product-manage', serveStatic('product-manage'));
viewsRouter.use('/orderlist', serveStatic('orderlist'));
viewsRouter.use('/sampleshopcart', serveStatic('sampleshopcart'));
viewsRouter.use('/orderpage', serveStatic('orderpage'));
viewsRouter.use('/ordercomplete', serveStatic('ordercomplete'));
viewsRouter.use('/homefragrance', serveStatic('homefragrance'));
viewsRouter.use('/handcare', serveStatic('handcare'));
viewsRouter.use('/bodycare', serveStatic('bodycare'));
viewsRouter.use('/perfume', serveStatic('perfume'));
viewsRouter.use('/userlists', serveStatic('userlists'));
// views 폴더의 최상단 파일인 rabbit.png, api.js 등을 쓸 수 있게 함
viewsRouter.use('/', serveStatic(''));

// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  // express.static 은 express 가 기본으로 제공하는 함수임
  return express.static(resourcePath, option);
}

export { viewsRouter };
