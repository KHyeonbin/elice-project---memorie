import * as Api from '/api.js';

// 요소(element) 할당
const orderTableBody = document.querySelector('#orderTableBody');

// 페이지 로드 시 전체 제품 조회 및 표시
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const orders = await Api.get('/orders/orderlist');
    displayOrders(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    alert('문제가 발생하였습니다. 다시 시도해 주세요.');
  }
});

// 제품 목록을 화면에 표시하는 함수
function displayOrders(orders) {
  orders.forEach((order, index) => {
    const orderRow = createOrderRow(order, index + 1); // 순번은 1부터 시작
    orderTableBody.appendChild(orderRow);
  });
}

// 개별 제품 행(row) 생성 함수
function createOrderRow(order, index) {
  const row = document.createElement('tr');
  // Date 객체로 변환 후 로컬 날짜 형식으로 포맷팅
  const createdAtDate = new Date(order.createdAt);
  //   const userType = member.isUser ? 'User' : 'Admin';
  const formattedDateTime = createdAtDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  row.innerHTML = `
    <td scope="row">${index}</td>
    <td scope="row">${order.name}</td>
    <td scope="row">${formattedDateTime}</td>
    <td scope="row">
      <select class="form-select status-select">
        <option value="주문접수" ${order.status === '주문접수' ? 'selected' : ''}>주문접수</option>
        <option value="배송중" ${order.status === '배송중' ? 'selected' : ''}>배송중</option>
        <option value="배송완료" ${order.status === '배송완료' ? 'selected' : ''}>배송완료</option>
      </select>
    </td>
  `;

  // 주문 상태 변경 이벤트 리스너 등록
  const statusSelect = row.querySelector('.status-select');
  statusSelect.addEventListener('change', async () => {
    const newStatus = statusSelect.value;

    try {
      // API를 호출하여 주문 상태 업데이트
      await updateOrderStatus(order._id, newStatus);
      alert('주문 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('주문 상태 업데이트에 실패했습니다. 다시 시도해 주세요.');
    }
  });

  return row;
}

// API 요청 함수 정의 - fetch를 사용하여 HTTP PUT 요청 보내기
async function updateOrderStatus(orderId, status) {
  const response = await fetch(`/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update order status');
  }
}
