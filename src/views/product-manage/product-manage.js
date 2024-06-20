import * as Api from '/api.js';

// 요소(element) 할당
const productTableBody = document.querySelector('#productTableBody');
const deleteButton = document.querySelector('.btn-danger');
const saveButton = document.querySelector('.btn-info');

// 페이지 로드 이벤트리스너
document.addEventListener('DOMContentLoaded', handleLoadProductList);

// 페이지 새로고침 실행 함수
async function handleLoadProductList() {
  try {
    productTableBody.innerHTML = ''; // 기존 목록 초기화
    const products = await Api.get('/products/productlist');
    displayProducts(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    alert('문제가 발생하였습니다. 다시 시도해 주세요.');
  }
}

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

  // 제품 행 클릭 시 상세 페이지로 이동하는 이벤트 리스너 추가
  row.addEventListener('click', (event) => {
    // 체크박스 클릭 시에는 상세 페이지로 이동하지 않음
    if (event.target.classList.contains('product-checkbox')) {
      event.stopPropagation();
      return;
    }
    window.location.href = `/product-update?id=${product._id}`;
  });
  return row;
}

// 제품 삭제 버튼 이벤트 리스너
deleteButton.addEventListener('click', async () => {
  // 선택된 제품 ID를 배열로 수집
  const selectedIds = Array.from(document.querySelectorAll('.product-checkbox:checked')).map((checkbox) =>
    checkbox.getAttribute('data-id'),
  );

  if (selectedIds.length === 0) {
    alert('삭제할 제품을 선택하세요.');
    return;
  }

  try {
    // DELETE 요청 보내기
    const response = await fetch('/products/productlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({ selectedIds }), // 선택된 ID들을 JSON 형식으로 파싱하여 body에 포함
    });

    if (response.ok) {
      alert('등록된 상품을 성공적으로 제거하였습니다!');
      await handleLoadProductList(); // 최신화된 상품 목록 불러오기
    } else {
      const errorContent = await response.json();
      alert('제품 삭제 실패: ' + (errorContent.reason || 'Unknown error'));
    }
  } catch (err) {
    console.error('상품 삭제 에러:', err);
    alert('제품 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.');
  }
});

// 전체 선택/해제 함수
