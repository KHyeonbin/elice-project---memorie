export const createNavbar = () => {
  const pathname = window.location.pathname;
  const isLogin = sessionStorage.getItem('token') ? true : false; // 로그인 상태 확인

  switch (pathname) {
    case '/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/about/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    /*case '/shopcart/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/orderpage/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/ordercomplete/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;*/
    case '/homefragrance/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/handcare/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/bodycare/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/perfume/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/users/mypage/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;
    case '/product-single/':
      if (isLogin) {
        addNavElements('logout');
      } else {
        addNavElements('register login');
      }
      break;

    default:
  }
};

// navbar ul 태그에, li 태그들을 삽입함)
const addNavElements = (keyString) => {
  const keys = keyString.split(' ');
  const isLogin = sessionStorage.getItem('token') ? true : false; // 로그인 상태 확인
  const container = document.querySelector('#navbar');

  // 로그인 안 된 상태에서만 보이게 될 navbar 요소들
  const itemsBeforeLogin = {
    register: '<li><a href="/register">회원가입</a></li>',
    login: '<li><a href="/login">로그인</a></li>',
  };

  // 로그인 완료된 상태에서만 보이게 될 navbar 요소들
  const itemsAfterLogin = {
    logout: '<li><a href="#" id="logout">로그아웃</a></li>',
  };

  // 로그아웃 요소만 유일하게, 클릭 이벤트를 필요로 함 (나머지는 href로 충분함)
  const logoutScript = document.createElement('script');
  logoutScript.innerText = `
        const logoutElem = document.querySelector('#logout'); 
        
        if (logoutElem) {
          logoutElem.addEventListener('click', () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('admin');
  
            window.location.href = '/';
          });
        }
    `;

  let items = '';
  for (const key of keys) {
    if (isLogin) {
      items += itemsAfterLogin[key] ?? '';
    } else {
      items += itemsBeforeLogin[key] ?? '';
    }
  }

  container.innerHTML = ''; // 기존의 내용을 지우고
  container.insertAdjacentHTML('afterbegin', items);

  // insertAdjacentHTML 은 문자열 형태 script를 실행하지는 않음.
  // append, after 등의 함수로 script 객체 요소를 삽입해 주어야 실행함.
  container.after(logoutScript);
};
