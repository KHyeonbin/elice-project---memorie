import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector('#fullNameInput');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButton = document.querySelector('#submitButton');

const toggleSwitch = document.getElementById('toggleSwitch');
const loginType = document.getElementById('loginType');

toggleSwitch.addEventListener('change', function () {
  if (this.checked) {
    loginType.textContent = '일반 회원가입';
  } else {
    loginType.textContent = '관리자 회원가입';
  }
  // toggleSwitch.checked = !toggleSwitch.checked;
});

submitButton.addEventListener('click', handleSubmit);

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const isUser = toggleSwitch.checked; // true => 사용자, false => 관리자
  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  console.log(isUser, fullName, email, password);

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;

  if (!isFullNameValid || !isPasswordValid) {
    return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
  }

  if (!isEmailValid) {
    return alert('이메일 형식이 맞지 않습니다.');
  }

  if (!isPasswordSame) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  // 회원가입 api 요청
  try {
    const data = JSON.stringify({ isUser, fullName, email, password });
    let result;

    if (isUser) {
      result = await fetch('/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
    } else {
      result = await fetch('/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
    }

    console.log(result);

    alert(`정상적으로 회원가입되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = '/login';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
