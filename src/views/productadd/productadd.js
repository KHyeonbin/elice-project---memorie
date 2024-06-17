import * as Api from '/api.js';

const form = document.getElementById('registerProductForm');
// 요소(element), input 혹은 상수 (HTML의 폼 입력요소 변수에 할당)
const nameInput = document.querySelector('#nameInput');
const categorySelectBox = document.querySelector('#categorySelectBox');
const descriptionInput = document.querySelector('#descriptionInput');
const imageInput = document.querySelector('#imageInput');
const priceInput = document.querySelector('#priceInput');
const manufacturerInput = document.querySelector('#manufacturerInput');
const submitButton = document.querySelector('#submitButton');

submitButton.addEventListener('click', handleSubmit);

// 상품등록 진행
async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name'); // 제품 이름
  const category = formData.get('category'); // 카테고리
  const manufacturer = formData.get('manufacturer'); // 제조사
  const description = formData.get('description'); // 제품 설명
  const imageFile = formData.get('image-file'); // 제품 사진
  const price = formData.get('price'); // 가격

  // 입력값 검증
  if (!name || name.length < 4) {
    return alert('제품 이름은 4글자 이상이어야 합니다.');
  }

  if (!manufacturer || manufacturer.length < 2) {
    return alert('제조사는 2글자 이상이어야 합니다.');
  }

  if (!category) {
    return alert('카테고리를 선택해 주세요.');
  }

  if (!price || isNaN(price) || price <= 0) {
    return alert('가격을 올바르게 입력해 주세요.');
  }

  if (!imageFile || !['image/png', 'image/jpeg', 'image/jpg'].includes(imageFile.type)) {
    return alert('유효한 이미지 파일을 선택해 주세요.');
  }

  // 상품등록 api 요청
  try {
    await fetch('/products/product', {
      method: 'POST',
      body: formData,
    });

    alert(`정상적으로 등록되었습니다.`);

    // 상품리스트로 이동
    window.location.href = '/productlist';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
