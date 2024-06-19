const userDataName = document.querySelector('.user-data--name');
const userDataEmail = document.querySelector('.user-data--email');

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const user = await fetch('/users/user-info');

    userDataName.innerHTML = `${user.name ?? '엘리스'}님, 안녕하세요!`;
    userDataEmail.innerHTML = `${user.email ?? 'elice@elice.com'}`;
  } catch (error) {
    console.error('유저 데이터를 fetch해오는 데 에러가 발생했습니다', error);
  }
});
