import "./index-MQVGeJDe.js";
hydrate();
function hydrate() {
  const postCardList = document.querySelectorAll("div[data-post-link]");
  postCardList.forEach((postCard) => {
    console.log(postCard);
    postCard.addEventListener("click", () => {
      const postLink = postCard.dataset.postLink;
      location.pathname = postLink;
    });
  });
}
