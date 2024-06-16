document.addEventListener('DOMContentLoaded', function () {
  fetch('/users/mypage', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const userDataFullName = document.querySelector('.user-data--fullname');
        const userDataEmail = document.querySelector('.user-data--email');

        userDataFullName.innerHTML = `${data.fullName ?? '엘리스'}님, 안녕하세요!`;
        userDataEmail.innerHTML = `${data.email ?? 'elice@elice.com'}`;
      } else {
        console.error('유저 데이터를 찾지 못했습니다');
      }
    })
    .catch((error) => {
      console.error('유저 데이터를 fetch해오는 데 에러가 발생했습니다', error);
    });
});
