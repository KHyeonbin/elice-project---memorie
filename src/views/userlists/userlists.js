import * as Api from '/api.js';

// 요소(element) 할당
const memberTableBody = document.querySelector('#memberTableBody');

// 페이지 로드 시 전체 제품 조회 및 표시
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const members = await Api.get('/users/memberlist');
    displayMembers(members);
  } catch (err) {
    console.error('Failed to fetch members:', err);
    alert('문제가 발생하였습니다. 다시 시도해 주세요.');
  }
});

// 제품 목록을 화면에 표시하는 함수
function displayMembers(members) {
  members.forEach((member, index) => {
    const memberRow = createMemberRow(member, index + 1); // 순번은 1부터 시작
    memberTableBody.appendChild(memberRow);
  });
}

// 개별 제품 행(row) 생성 함수
function createMemberRow(member, index) {
  const row = document.createElement('tr');
  // Date 객체로 변환 후 로컬 날짜 형식으로 포맷팅
  const createdAtDate = new Date(member.createdAt);
  const userType = member.isUser ? 'User' : 'Admin';
  const formattedDate = createdAtDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  row.innerHTML = `
    <td scope="row">${index}</td>
    <td scope="row">${member.name}</td>
    <td scope="row">${member.email}</td>
    <td scope="row">${userType}</td>
    <td scope="row">${formattedDate}</td>
  `;

  return row;
}
