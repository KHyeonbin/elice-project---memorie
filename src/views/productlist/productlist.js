import * as Api from '../../api.js';
import { randomId, getUrlParams, addCommas, navigate } from '../../useful-functions.js';

// 요소(element), input 혹은 상수
const productItemContainer = document.querySelector('#producItemContainer');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
  addProductItemsToContainer();
}

// addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

async function addProductItemsToContainer() {
  const { category } = getUrlParams();
  const products = await Api.get(`/products/productlist`);

  products.forEach(async (product) => {
    // 객체 destructuring
    const { _id, title, description, isRecommended, price } = product;
    const imageUrl = await getImageUrl(imageKey);
    const random = randomId();

    productItemContainer.insertAdjacentHTML(
      'beforeend',
      `
      <div class="message media product-item" id="a${random}">
        <div class="media-left">
          <figure class="image">
            <img
              src="${imageUrl}"
              alt="제품 이미지"
            />
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p class="title">
              ${title}
              ${isRecommended ? '<span class="tag is-success is-rounded">추천</span>' : ''}
            </p>
            <p class="description">${description}</p>
            <p class="price">${addCommas(price)}원</p>
          </div>
        </div>
      </div>
      `,
    );

    const productItem = document.querySelector(`#a${random}`);
    productItem.addEventListener('click', navigate(`/product/detail?id=${_id}`));
  });
}
