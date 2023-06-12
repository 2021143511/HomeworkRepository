let cnt = 1;

let categoryGroup = [];
let finalGroup = [];

const category = document.querySelector(".main-section__category");
const searchTerm = document.querySelector(".main-section__searchText");
const sorting = document.querySelector(".main-section__sorting");
const searchBtn = document.querySelector(".main-section__searchBtn");
const main = document.querySelector(".main-section__grid");
const loading = document.getElementById("msg-loading");

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const products = main.innerHTML;
    initialize(JSON.parse(products));
  },
  false
);

function initialize(products) {
  let visibleItems = 8; // 한 번에 보여줄 아이템 개수
  let loadedItems = 0; // 현재 로드된 아이템 개수

  let lastCategory = "";
  let lastSearch = "";
  let lastSort = "";

  finalGroup = products;
  updateDisplay();

  searchBtn.addEventListener("click", selectCategory);

  function selectCategory(e) {
    e.preventDefault();
    cnt = 1;

    categoryGroup = [];
    finalGroup = [];

    if (
      category.value === lastCategory &&
      searchTerm.value.trim() === lastSearch &&
      sorting.value === lastSort
    ) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();

      lastSort = sorting.value;
      if (category.value === "all") {
        categoryGroup = products;
        selectProducts();
      } else {
        const lowerCaseType = category.value.toLowerCase();
        categoryGroup = products.filter(
          (product) => product.product_category === lowerCaseType
        );
        selectProducts();
      }
    }
  }

  function selectProducts() {
    if (searchTerm.value.trim() !== "") {
      let lower_term = searchTerm.value.trim().toLowerCase();
      for (let i = 0; i < categoryGroup.length; i++) {
        if (
          categoryGroup[i].product_title.toLowerCase().indexOf(lower_term) !==
          -1
        ) {
          finalGroup.push(categoryGroup[i]);
        }
      }
    } else {
      finalGroup = categoryGroup;
    }

    sortProducts();
  }

  function sortProducts() {
    if (sorting.value === "abc") {
      finalGroup.sort((a, b) => {
        if (a.product_title.toLowerCase() < b.product_title.toLowerCase()) {
          return -1;
        } else if (
          a.product_title.toLowerCase() > b.product_title.toLowerCase()
        ) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sorting.value === "low-price") {
      finalGroup.sort((a, b) => a.product_price - b.product_price);
    } else if (sorting.value === "high-price") {
      finalGroup.sort((a, b) => b.product_price - a.product_price);
    }
    updateDisplay();
  }

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if (finalGroup.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No results!";
      main.appendChild(para);
      loading.style.display = "none";
    } else {
      load();
    }
  }

  function load() {
    loading.style.display = "block";
    for (let i = (cnt - 1) * 6; i < cnt * 6; i++) {
      if (i >= finalGroup.length) {
        break;
      }
      createProductElement(finalGroup[i]);
    }

    if ((cnt - 1) * 6 >= finalGroup.length) {
      cnt = finalGroup.length;
      loading.style.display = "none";
    } else {
      cnt = cnt + 1;
    }
  }

  function createProductElement(product) {
    const productContainer = document.createElement("div");
    productContainer.className = "main-section__product";

    const productImg = document.createElement("img");
    productImg.src = product.product_image;
    productImg.alt = product.product_title;
    productImg.className = "main-section__product-image";

    const productHoverText = document.createElement("p");
    productHoverText.innerHTML = `${product.product_title} <br /> ${product.product_price}원`;
    productHoverText.className = "main-section__product-hoverText";

    productContainer.appendChild(productImg);
    productContainer.appendChild(productHoverText);
    productContainer.addEventListener("click", () => {
      location.href = `/product/${product.product_id}`;
    });
    main.appendChild(productContainer);
  }

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setTimeout(() => {
        load();
      }, 1000);
    }
  };
}
