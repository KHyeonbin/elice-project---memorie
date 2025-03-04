import { validateEmail, blockIfLogin, createNavbar } from '/useful-functions.js';

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

blockIfLogin();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  createNavbar();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

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
    return alert('아이디는 이메일 형태로 작성해주세요.');
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    // 사용자 : POST /users/login
    // 관리자 : POST /admin/login
    const response = isUser
      ? await fetch('/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'same-origin',
        })
      : await fetch('/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'same-origin',
        });

    if (!response.ok) {
      throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
    }

    const result = await response.json();
    const { token } = result;

    // 로그인 성공, 토큰을 세션 스토리지에 저장
    sessionStorage.setItem('token', token);

    if (result) {
      alert(`정상적으로 로그인되었습니다.`);
    }

    window.location.href = isUser ? '/' : '/admin';
  } catch (err) {
    console.error(err.stack);
    alert(`비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.`);
  }
}
