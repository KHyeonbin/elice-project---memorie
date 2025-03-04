// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
/*function{
import * as Api from "/api.js";
import { randomId } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const landingDiv = document.querySelector("#landingDiv");
const greetingDiv = document.querySelector("#greetingDiv");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  insertTextToGreeting();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  landingDiv.addEventListener("click", alertLandingText);
  greetingDiv.addEventListener("click", alertGreetingText);
}

function insertTextToLanding() {
  landingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
    `
  );
}

function insertTextToGreeting() {
  greetingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
    `
  );
}

function alertLandingText() {
  alert("n팀 쇼핑몰입니다. 안녕하세요.");
}

function alertGreetingText() {
  alert("n팀 쇼핑몰에 오신 것을 환영합니다");
}

async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const data = await Api.get("/api/user/data");
  const random = randomId();

  console.log({ data });
  console.log({ random });
}
}*/

import * as Api from '/api.js';
import { createNavbar } from '/useful-functions.js';

// 요소(element) 할당
const productsContainer = document.querySelector('#productsContainer');

// 검색버튼, 검색창 element 가져오기
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');

// 페이지 로드 시 전체 상품 조회 및 표시
document.addEventListener('DOMContentLoaded', handleProductLoad);

// 검색어를 입력하고 검색버튼 누르면 부분 상품 조회 및 표시
searchButton.addEventListener('click', handleSearchSubmit);

// X를 눌러 검색창을 비우면 다시 전체 상품 표시
searchInput.addEventListener('input', handleSearchReset);

addAllElements();
addAllEvents();

async function addAllElements() {
  createNavbar();
}
function addAllEvents() {}

// 전체 상품 불러오기
async function handleProductLoad() {
  try {
    const products = await Api.get('/products/productlist');
    displayProducts(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    alert('문제가 발생하였습니다. 다시 시도해 주세요.');
  }
}

async function handleSearchSubmit(e) {
  e.preventDefault();

  try {
    const searchStr = searchInput.value;
    const encodedSearchStr = encodeURIComponent(searchStr);
    const response = await fetch(`/search?val=${encodedSearchStr}`);
    if (!response.ok) {
      throw new Error('검색 결과를 가져오는 데 실패했습니다.');
    }

    const products = await response.json();
    displayProducts(products);
  } catch (err) {
    console.log(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 검색창이 비워지면 다시 전체 상품 표시
function handleSearchReset(e) {
  e.preventDefault();

  if (e.target.value === '') {
    handleProductLoad();
  }
}

// 상품 목록을 화면에 표시하는 함수
function displayProducts(products) {
  // 기존 내용을 지우기
  productsContainer.innerHTML = '';

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
  cardDiv.style.cursor = 'pointer';
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
