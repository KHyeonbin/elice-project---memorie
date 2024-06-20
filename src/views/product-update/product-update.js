import * as Api from '/api.js';
import { getUrlParams, addCommas, checkUrlParams } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const nameInput = document.querySelector('#nameInput');
const nameToggle = document.querySelector('#nameToggle');
const categorySelectBox = document.querySelector('#categorySelectBox');
const categoryToggle = document.querySelector('#categoryToggle');
const descriptionInput = document.querySelector('#descriptionInput');
const descriptionToggle = document.querySelector('#descriptionToggle');
const imageInput = document.querySelector('#imageInput');
const imageToggle = document.querySelector('#imageToggle');
const priceInput = document.querySelector('#priceInput');
const priceToggle = document.querySelector('#priceToggle');
const manufacturerInput = document.querySelector('#manufacturerInput');
const manufacturerToggle = document.querySelector('#manufacturerToggle');
const saveButton = document.querySelector('#saveButton');

checkUrlParams('id');
addAllElements();
addAllEvents();

// 요소 삽입 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
  insertProductData();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  nameToggle.addEventListener('change', toggleTargets);
  categoryToggle.addEventListener('change', toggleTargets);
  descriptionToggle.addEventListener('change', toggleTargets);
  imageToggle.addEventListener('change', toggleTargets);
  priceToggle.addEventListener('change', toggleTargets);
  manufacturerToggle.addEventListener('change', toggleTargets);

  saveButton.addEventListener('click', saveProductData);
  saveButton.addEventListener('click', () => {
    window.location.href = `/product-manage`;
  });
}

// input 및 주소찾기 버튼의 disabled <-> abled 상태를 토글함.
function toggleTargets(e) {
  const toggleId = e.target.id;
  const isChecked = e.target.checked;

  // 어떤 요소들의 토글인지 확인
  let targets;

  if (toggleId.includes('name')) {
    targets = [nameInput];
  }
  if (toggleId.includes('category')) {
    targets = [categorySelectBox];
  }
  if (toggleId.includes('manufacturer')) {
    targets = [manufacturerInput];
  }
  if (toggleId.includes('description')) {
    targets = [descriptionInput];
  }
  if (toggleId.includes('image')) {
    targets = [imageInput];
  }
  if (toggleId.includes('price')) {
    targets = [priceInput];
  }

  // 여러 개의 타겟이 있을 때, 첫 타겟만 focus 시키기 위한 flag
  let isFocused;

  // 토글 진행
  for (const target of targets) {
    if (isChecked) {
      target.removeAttribute('disabled');

      !isFocused && target.focus();
      isFocused = true;

      continue;
    }
  }

  // 열림 토글인 경우는 여기서 끝
  if (isChecked) {
    return;
  }

  // 닫힘 토글인 경우임. disabled 처리를 위해 다시 한번 for 루프 씀.
  for (const target of targets) {
    target.setAttribute('disabled', '');
  }
}

// 페이지 로드 시 실행
// 나중에 사용자가 데이터를 변경했는지 확인하기 위해, 전역 변수로 userData 설정
let productData;
async function insertProductData() {
  const { id } = getUrlParams();
  productData = await Api.get(`/products/product/${id}`);

  // 객체 destructuring
  const { name, category, manufacturer, description, imageFile, price } = productData;

  // 서버에서 온 비밀번호는 해쉬 문자열인데, 이를 빈 문자열로 바꿈
  // 나중에 사용자가 비밀번호 변경을 위해 입력했는지 확인하기 위함임.
  nameInput.value = name;

  if (category) {
    categorySelectBox.value = category;
  }

  if (manufacturer) {
    manufacturerInput.value = manufacturer;
  }

  if (description) {
    descriptionInput.value = description;
  }

  if (imageFile) {
    imageInput.value = imageFile;
  }

  if (price) {
    priceInput.value = price;
  }

  // 기본적으로 disabled 상태로 만듦
  disableForm();
}

function disableForm() {
  nameInput.setAttribute('disabled', '');
  nameToggle.checked = false;
  categorySelectBox.setAttribute('disabled', '');
  categoryToggle.checked = false;
  descriptionInput.setAttribute('disabled', '');
  descriptionToggle.checked = false;
  imageInput.setAttribute('disabled', '');
  imageToggle.checked = false;
  priceInput.setAttribute('disabled', '');
  priceToggle.checked = false;
  manufacturerInput.setAttribute('disabled', '');
  manufacturerToggle.checked = false;
}

// db에 정보 저장
async function saveProductData(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', nameInput.value);
  formData.append('category', categorySelectBox.value);
  formData.append('manufacturer', manufacturerInput.value);
  formData.append('description', descriptionInput.value);
  formData.append('price', priceInput.value);

  if (imageInput.files.length > 0) {
    formData.append('image-file', imageInput.files[0]);
  }

  const { _id } = productData;

  const headers = {};
  if (!(formData instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    formData = JSON.stringify(formData);
  }

  const response = await fetch(`/products/amend/${_id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('상품 정보 수정 중 오류가 발생했습니다.');
  }

  alert('상품 정보가 수정되었습니다.');
  window.location.href = `/product/${_id}`;
}
