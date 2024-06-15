import * as Api from '/api.js';

const idInput = document.querySelector('#idInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButton');

submitButton.addEventListener('click', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  const id = idInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isIdValid = id.length >= 4;
  const isPasswordValid = password.length >= 4;

  if (!isIdValid || !isPasswordValid) {
    return alert('아이디와 비밀번호가 4글자 이상인지 확인해 주세요.');
  }

  try {
    const data = { id, password };

    const result = await Api.post('/admin/login', data);

    console.log(result);

    const token = result.token;

    sessionStorage.setItem('token', token);

    alert('관리자 로그인 성공. 관리자 페이지로 이동합니다.');

    window.location.href = '/admin';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
