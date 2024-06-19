import * as Api from '/api.js';
import { getUrlParams, addCommas, checkUrlParams, createNavbar } from '/useful-functions.js';
import { addToDb, putToDb } from '/indexed-db.js';

// 요소(element), input 혹은 상수
const manufacturerTag = document.querySelector('#manufacturerTag');
const nameTag = document.querySelector('#nameTag');
const imageTag = document.querySelector('#imageTag');
const descriptionTag = document.querySelector('#descriptionTag');
const addToCartButton = document.querySelector('#addToCartButton');
const purchaseButton = document.querySelector('#purchaseButton');

checkUrlParams('id');
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
  insertProductData();
  createNavbar();
}

// addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

async function insertProductData() {
  const { id } = getUrlParams();
  const product = await Api.get(`/products/product/${id}`);

  // 객체 destructuring
  const { imageUrl, name, description, manufacturer, price } = product;

  imageTag.src = imageUrl;
  nameTag.innerText = name;
  descriptionTag.innerText = description;
  manufacturerTag.innerText = manufacturer;
  priceTag.innerText = `${addCommas(price)}원`;

  addToCartButton.addEventListener('click', async () => {
    try {
      await insertDb(product);

      alert('장바구니에 추가되었습니다.');
      window.history.back();
    } catch (err) {
      // Key already exists 에러면 아래와 같이 alert함
      if (err.message.includes('Key')) {
        alert('이미 장바구니에 추가되어 있습니다.');
      }

      console.log(err);

      window.location.href = '/sampleshopcart';
    }
  });
}

async function insertDb(product) {
  // 객체 destructuring
  const { _id: id, price } = product;

  // 장바구니 추가 시, indexedDB에 제품 데이터 및
  // 주문수량 (기본값 1)을 저장함.
  await addToDb('cart', { ...product, quantity: 1 }, id);

  // 장바구니 요약(=전체 총합)을 업데이트함.
  await putToDb('order', 'summary', (data) => {
    // 기존 데이터를 가져옴
    const count = data.productsCount;
    const total = data.productsTotal;
    const ids = data.ids;
    const selectedIds = data.selectedIds;

    // 기존 데이터가 있다면 1을 추가하고, 없다면 초기값 1을 줌
    data.productsCount = count ? count + 1 : 1;

    // 기존 데이터가 있다면 가격만큼 추가하고, 없다면 초기값으로 해당 가격을 줌
    data.productsTotal = total ? total + price : price;

    // 기존 데이터(배열)가 있다면 id만 추가하고, 없다면 배열 새로 만듦
    data.ids = ids ? [...ids, id] : [id];

    // 위와 마찬가지 방식
    data.selectedIds = selectedIds ? [...selectedIds, id] : [id];
  });
}
