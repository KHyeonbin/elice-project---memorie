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
    if (result) {
      alert(`정상적으로 로그인되었습니다.`);
    }

    window.location.href = isUser ? '/' : '/admin';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
