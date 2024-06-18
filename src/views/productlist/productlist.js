import * as Api from '/api.js';
// 요소(element) 할당
const productsContainer = document.querySelector('#productsContainer');

// 페이지 로드 시 전체 상품 조회 및 표시
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const products = await Api.get('/products/productlist');
    displayProducts(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    alert('문제가 발생하였습니다. 다시 시도해 주세요.');
  }
});

// 상품 목록을 화면에 표시하는 함수
function displayProducts(products) {
  products.forEach((product) => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

// 개별 상품 카드 생성 함수
function createProductCard(product) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-12 col-md-4 mb-4';

  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  cardDiv.addEventListener('click', () => {
    window.location.href = `/product-single?id=${product._id}`;
  });

  const img = document.createElement('img');
  img.src = product.imageUrl;
  img.className = 'card-img-top';
  img.alt = product.name;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const name = document.createElement('h5');
  name.className = 'card-name';
  name.textContent = product.name;

  const text = document.createElement('p');
  text.className = 'card-text';
  text.textContent = product.description;

  const price = document.createElement('p');
  price.className = 'card-text';
  price.textContent = `가격: ${product.price} 원`;

  cardBody.appendChild(name);
  cardBody.appendChild(text);
  cardBody.appendChild(price);
  cardDiv.appendChild(img);
  cardDiv.appendChild(cardBody);
  colDiv.appendChild(cardDiv);

  return colDiv;
}
