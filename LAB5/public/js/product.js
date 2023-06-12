const productDiv = document.querySelector("#productData");
const product = JSON.parse(productDiv.innerHTML)[0];
const main = document.querySelector("main");

document.addEventListener(
  "DOMContentLoaded",
  () => {
    productDiv.innerHTML = "";

    const productImg = document.createElement("img");
    productImg.className = "main__product-image";
    productImg.alt = product.product_title;
    productImg.src = "." + product.product_image;
    main.appendChild(productImg);

    const articleTitle = document.createElement("article");
    articleTitle.innerHTML = `<strong>ID</strong><br><strong>Title</strong><br><strong>Price</strong><br><strong>Category</strong>`;
    articleTitle.className = "main__article-title";
    main.appendChild(articleTitle);

    const articleContents = document.createElement("article");
    articleContents.innerHTML = `${product.product_id} <br> ${product.product_title}<br>${product.product_price} 원<br> ${product.product_category}`;
    articleContents.className = "main__article-contents";
    main.appendChild(articleContents);
  },
  false
);

fetch("../comment.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((comments) => showReview(comments))
  .catch((err) => console.error(`Fetch problem: ${err.message}`));

function showReview(comments) {
  const comment = comments[product.product_id];

  const reviewContainer = document.createElement("div");
  reviewContainer.id = "comments_table";
  const reviewTitle = document.createElement("div");
  reviewTitle.className = "zeroth_comment";
  reviewTitle.style = "text-align: center; font-size: 20px; font-weight: bold;";
  reviewTitle.innerHTML = "리뷰";
  reviewContainer.appendChild(reviewTitle);

  for (var i = 1; i <= Object.keys(comment).length; i++) {
    const review = document.createElement("div");
    review.style = "text-align: center;";
    review.innerHTML = comment[String(i)] + "<br>";
    reviewContainer.appendChild(review);
  }

  main.appendChild(reviewContainer);

  const article = document.createElement("article");
  article.className = "comment_submit";
  article.innerHTML = `<label for='new_comment'><strong>리뷰를 작성해주세요</strong></label><br><input type='text' id='new_comment' placeholder='리뷰 작성' /><br><button type='button' id='submit_new_comment' onclick='makeComment()'>제출하기</button>`;
  main.appendChild(article);
}

function makeComment() {
  const commentInput = document.getElementById("new_comment");
  return fetch("/product/:" + product.product_id, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify({ comment: commentInput.value }),
  }).then((response) => response.json()); // parses JSON response into native JavaScript objects
}
