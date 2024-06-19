// import * as Api from '/api.js';
// 요소(element) 할당

document.addEventListener('DOMContentLoaded', function () {
  fetch('/products/homefragrance')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
      }
      const productsContainer = document.getElementById('productsContainer');
      data.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('col-md-4');
        productDiv.innerHTML = `
            <div class="card">
              <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text"><strong>가격: </strong>${product.price}원</p>
              </div>
            </div>
          `;
        productDiv.style.cursor = 'pointer';
        productsContainer.appendChild(productDiv);
        productDiv.addEventListener('click', () => {
          window.location.href = `/product-single?id=${product._id}`;
        });
      });
    })
    .catch((error) => console.error('Error fetching products:', error));
});
