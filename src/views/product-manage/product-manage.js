import * as Api from '/api.js';

// 요소(element) 할당
const productTableBody = document.querySelector('#productTableBody');
// const deleteButton = document.querySelector('.btn-danger');
// const saveButton = document.querySelector('.btn-info');

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
    <td scope="row"><input type="checkbox" scope="row"class="product-checkbox" data-id="${product._id}" /></td>
    <td scope="row"><img src="${product.imageUrl}" alt="${product.name}" width="50" /></td>
    <td scope="row">${product.name}</td>
    <td scope="row">${product.price} 원</td>
    <td scope="row">${product.description}</td>
    <td scope="row">${product.manufacturer}</td>
  `;

  return row;
}
