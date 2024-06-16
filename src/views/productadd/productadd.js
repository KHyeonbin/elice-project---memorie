import * as Api from '/api.js';

// 요소(element), input 혹은 상수 (HTML의 폼 입력요소 변수에 할당)
const titleInput = document.querySelector('#titleInput');
const categorySelectBox = document.querySelector('#categorySelectBox');
const manufacturerInput = document.querySelector('#manufacturerInput');
const descriptionInput = document.querySelector('#descriptionInput');
const imageInput = document.querySelector('#imageInput');
const priceInput = document.querySelector('#priceInput');
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

  const title = titleInput.value;
  const category = categorySelectBox.value;
  const manufacturer = manufacturerInput.value;
  const description = descriptionInput.value;
  const price = parseFloat(priceInput.value);
  const imageFile = imageInput.files[0];

  // 잘 입력했는지 확인
  const isTitleValid = title.length >= 3;
  const isManufacturerValid = manufacturer.length >= 2;

  if (!isTitleValid || !isManufacturerValid) {
    return alert('이름은 3글자 이상, 제조사는 2글자 이상이어야 합니다.');
  }
  // 상품등록 api 요청
  try {
    const data = { title, category, manufacturer, description, price, imageFile };

    await Api.post('/products/product', data);

    alert(`정상적으로 등록되었습니다.`);
    // 홈 이동 (-> 마이페이지로 가는게 나을듯)
    window.location.href = '/users/mypage';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
