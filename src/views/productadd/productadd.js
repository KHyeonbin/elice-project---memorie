import * as Api from '/api.js';

// 요소(element), input 혹은 상수 (HTML의 폼 입력요소 변수에 할당)
const nameInput = document.querySelector('#nameInput');
const categorySelectBox = document.querySelector('#categorySelectBox');
const descriptionInput = document.querySelector('#descriptionInput');
const imageInput = document.querySelector('#imageInput');
const priceInput = document.querySelector('#priceInput');
const manufacturerInput = document.querySelector('#manufacturerInput');
const submitButton = document.querySelector('#submitButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener('click', handleSubmit);
}

// 상품등록 진행
async function handleSubmit(e) {
  e.preventDefault();

  const name = nameInput.value;
  const category = categorySelectBox.value;
  const description = descriptionInput.value;
  const imageFile = imageInput.files[0];
  const price = priceInput.value;
  const manufacturer = manufacturerInput.value;

  // 잘 입력했는지 확인
  const isNameValid = name.length >= 4;
  const isManufacturerValid = manufacturer.length >= 2;

  if (!isNameValid || !isManufacturerValid) {
    return alert('이름은 2글자 이상, 제조사는 4글자 이상이어야 합니다.');
  }

  // 상품등록 api 요청
  try {
    const data = { name, category, price, description, imageFile, manufacturer };

    await Api.post('/products/product', data);

    alert(`정상적으로 등록되었습니다.`);

    // 홈 이동
    window.location.href = '/productlist';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
