const userDataName = document.querySelector('.user-data--name');
const userDataEmail = document.querySelector('.user-data--email');

// element for update
const userEditBtn = document.querySelector('.user-edit--btn');
const userNameEdit = document.querySelector('.user-name-edit');
const userEmailEdit = document.querySelector('.user-email-edit');

// element for delete
const userDeleteBtn = document.querySelector('.user-delete--btn');

// mypage.html 로드 시
document.addEventListener('DOMContentLoaded', handleLoadUserInfo);

// 유저 정보 새로고침 함수
async function handleLoadUserInfo() {
  try {
    const response = await fetch('/users/user-info');

    const user = await response.json();
    userDataName.innerHTML = `${user.name}님, 안녕하세요!`;
    userDataEmail.innerHTML = `${user.email}`;
  } catch (error) {
    console.error('유저 데이터를 fetch해오는 데 에러가 발생했습니다', error);
  }
}

userEditBtn.addEventListener('click', handleEdit);

async function handleEdit() {
  // 초기값 => 수정 모드
  if (userNameEdit.style.display === 'none') {
    userDataName.style.display = 'none';
    userDataEmail.style.display = 'none';
    userNameEdit.style.display = '';
    userEmailEdit.style.display = '';
  }
  // 수정 후 => 적용 모드
  else {
    userDataName.style.display = '';
    userDataEmail.style.display = '';
    userNameEdit.style.display = 'none';
    userEmailEdit.style.display = 'none';

    const newName = userNameEdit.value;
    const newEmail = userEmailEdit.value;

    try {
      await fetch('/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });

      handleLoadUserInfo();
    } catch (error) {
      console.error('유저 정보 수정에 실패했습니다.', error);
    }
  }
}

userDeleteBtn.addEventListener('click', handleDelete);

async function handleDelete() {
  // 정말로 지울 건지 선택 받기
  const isDelete = confirm('정말로 회원 탈퇴하시겠습니까? 탈퇴한 이후에는 복구가 불가합니다!');

  if (!isDelete) {
    return;
  }

  // 삭제 요청
  try {
    await fetch('/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.error('회원 탈퇴에 실패했습니다. 일시적인 오류일 수 있습니다. 새로고침하여 다시 시도해 주십시오.');
  }
}
