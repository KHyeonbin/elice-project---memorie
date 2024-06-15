import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

const toggleSwitch = document.querySelector('#toggleSwitch');
const loginType = document.querySelector('#loginType');

toggleSwitch.addEventListener('change', function () {
  if (this.checked) {
    loginType.textContent = '일반 로그인';
  } else {
    loginType.textContent = '관리자 로그인';
  }
});

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButton');

submitButton.addEventListener('click', handleSubmit);

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const isUser = toggleSwitch.checked; // true => 사용자, false => 관리자
  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert('비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.');
  }

  // 로그인 api 요청
  try {
    const data = { isUser, email, password };
    let result;

    if (isUser) {
      result = await Api.post('/users/login', data);
    } else {
      result = await Api.post('/admin/login', data);
    }

    const token = result.token;

    // 로그인 성공, 토큰을 세션 스토리지에 저장
    // 물론 다른 스토리지여도 됨
    sessionStorage.setItem('token', token);

    alert(`정상적으로 로그인되었습니다.`);

    // 로그인 성공

    // 기본 페이지로 이동
    if (isUser) {
      window.location.href = '/';
    } else {
      window.location.href = '/admin';
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
