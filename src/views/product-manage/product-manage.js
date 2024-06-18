import * as Api from '/api.js';

// 요소(element) 할당
const productTableBody = document.querySelector('#productTableBody');
const deleteButton = document.querySelector('.btn-danger');
const saveButton = document.querySelector('.btn-info');

// 페이지 로드 시 전체 제품 조회 및 표시
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const products = await Api.get('/products/productlist');
    displayProducts(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    alert('문제가 발생하였습니다. 다시 시도해 주세요.');
  }
});

// 제품 목록을 화면에 표시하는 함수
function displayProducts(products) {
  products.forEach((product) => {
    const productRow = createProductRow(product);
    productTableBody.appendChild(productRow);
  });
}

// 개별 제품 행(row) 생성 함수
function createProductRow(product) {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td scope="row"><input type="checkbox" scope="row" class="product-checkbox" data-id="${product._id}" /></td>
    <td scope="row"><img src="${product.imageUrl}" alt="${product.name}" width="50" /></td>
    <td scope="row">${product.name}</td>
    <td scope="row">${product.price} 원</td>
    <td scope="row">${product.description}</td>
    <td scope="row">${product.manufacturer}</td>
  `;

  return row;
}

// 제품 삭제 버튼 이벤트 리스너
deleteButton.addEventListener('click', async () => {
  // 선택된 제품 ID를 배열로 수집
  const selectedIds = Array.from(document.querySelectorAll('.product-checkbox:checked')).map((checkbox) =>
    checkbox.getAttribute('data-id'),
  );

  if (selectedIds.length == 0) {
    alert('삭제할 제품을 선택하세요.');
    return;
  }

  try {
    // DELETE 요청 보내기
    const response = await Api.delete('/products/productlist', { selectedIds });
    if (response.success) {
      alert('선택한 제품이 삭제되었습니다.');
      await fetchProducts(); // 페이지 새로고침 대신 다시 불러오기
    } else {
      alert('제품 삭제 실패: ' + response.message);
    }
  } catch (err) {
    console.error('Error deleting products:', err);
    alert('제품 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.');
  }
});

// 전체 선택/해제 함수
function toggle(source) {
  const checkboxes = document.querySelectorAll('.product-checkbox');
  checkboxes.forEach((checkbox) => (checkbox.checked = source.checked));
}
