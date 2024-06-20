import * as Api from '/api.js';
import { checkLogin, addCommas, convertToNumber, navigate, randomPick, createNavbar } from '/useful-functions.js';
import { deleteFromDb, getFromDb, putToDb } from '/indexed-db.js';

// 요소(element), input 혹은 상수
const subtitleCart = document.querySelector('#subtitleCart');
const nameInput = document.querySelector('#name');
const numberInput = document.querySelector('#number');
const postalCodeInput = document.querySelector('#postalCode');
const searchAddressButton = document.querySelector('#searchAddressButton');
const address1Input = document.querySelector('#address1');
const address2Input = document.querySelector('#address2');
const productsTitleElem = document.querySelector('#productsTitle');
const productsTotalElem = document.querySelector('#productsTotal');
const deliveryFeeElem = document.querySelector('#deliveryFee');
const priceElem = document.querySelector('#price');
const checkoutButton = document.querySelector('#checkoutButton');

checkLogin();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
  createNavbar();
  insertOrderSummary();
}

// addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  subtitleCart.addEventListener('click', navigate('/sampleshopcart'));
  searchAddressButton.addEventListener('click', searchAddress);
  checkoutButton.addEventListener('click', doCheckout);
}

// Daum 주소 API (사용 설명 https://postcode.map.daum.net/guide)
function searchAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      } else {
      }

      postalCodeInput.value = data.zonecode;
      address1Input.value = `${addr} ${extraAddr}`;
      address2Input.placeholder = '상세 주소를 입력해 주세요.';
      address2Input.focus();
    },
  }).open();
}

// 페이지 로드 시 실행되며, 결제정보 카드에 값을 삽입함.
async function insertOrderSummary() {
  const { ids, selectedIds, productsTotal } = await getFromDb('order', 'summary');

  // 구매할 아이템이 없다면 다른 페이지로 이동시킴
  const hasItemInCart = ids.length !== 0;
  const hasItemToCheckout = selectedIds.length !== 0;

  if (!hasItemInCart) {
    alert(`구매할 제품이 없습니다. 제품을 선택해 주세요.`);

    return window.location.replace(`/`);
  }

  if (!hasItemToCheckout) {
    alert('구매할 제품이 없습니다. 장바구니에서 선택해 주세요.');

    return window.location.replace('/sampleshopcart');
  }

  // 화면에 보일 상품명
  let productsTitle = '';

  for (const id of selectedIds) {
    const { name, quantity } = await getFromDb('cart', id);
    // 첫 제품이 아니라면, 다음 줄에 출력되도록 \n을 추가함
    if (productsTitle) {
      productsTitle += '\n';
    }

    productsTitle += `${name} / ${quantity}개`;
  }

  productsTitleElem.innerText = productsTitle;
  productsTotalElem.innerText = `${addCommas(productsTotal)}원`;

  if (hasItemToCheckout) {
    deliveryFeeElem.innerText = `3,000원`;
    priceElem.innerText = `${addCommas(productsTotal + 3000)}원`;
  } else {
    deliveryFeeElem.innerText = `0원`;
    priceElem.innerText = `0원`;
  }

  nameInput.focus();
}

// 결제 진행
async function doCheckout() {
  const name = nameInput.value;
  const number = numberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;
  const summaryTitle = productsTitleElem.innerText;
  const price = convertToNumber(priceElem.innerText);
  const { selectedIds } = await getFromDb('order', 'summary');

  if (!name || !number || !postalCode || !address2) {
    return alert('배송지 정보를 모두 입력해 주세요.');
  }

  const address = {
    postalCode,
    address1,
    address2,
    name,
    number,
  };

  try {
    // 제품별로 주문아이템을 등록함
    for (const productId of selectedIds) {
      const { quantity, price } = await getFromDb('cart', productId);
      const totalPrice = quantity * price;

      await Api.post('/orders/order', {
        name,
        number,
        address,
        price,
      });

      // indexedDB에서 해당 제품 관련 데이터를 제거함
      await deleteFromDb('cart', productId);
      await putToDb('order', 'summary', (data) => {
        data.ids = data.ids.filter((id) => id !== productId);
        data.selectedIds = data.selectedIds.filter((id) => id !== productId);
        data.productsCount -= 1;
        ``;
        data.productsTotal -= totalPrice;
      });
    }

    alert('결제 및 주문이 정상적으로 완료되었습니다.\n감사합니다.');
    window.location.href = '/ordercomplete';
  } catch (err) {
    console.log(err);
    alert(`결제 중 문제가 발생하였습니다: ${err.message}`);
  }
}
