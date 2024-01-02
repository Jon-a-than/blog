import { s as serviceWorkerPromise } from "./index-I7noDNMX.js";
hydrate();
async function hydrate() {
  const postCardList = document.querySelectorAll("div[data-post-link]");
  postCardList.forEach((postCard) => {
    console.log(postCard);
    postCard.addEventListener("click", () => {
      const postLink = postCard.dataset.postLink;
      location.pathname = `${"/21081715/dist/"}${postLink}`;
    });
  });
  await serviceWorkerPromise;
  renderLatestComment();
}
async function renderLatestComment(limit = 10) {
  const commentList = await apiGetLatestComments(limit);
  const CommentContainer = document.querySelector("#latestComments");
  const CommentTemplate = document.querySelector("#comment");
  const anchor = CommentTemplate.content.querySelector("a");
  commentList.forEach(({ comment, postLink }) => {
    anchor.textContent = comment;
    anchor.href = postLink;
    const clone = document.importNode(CommentTemplate.content, true);
    CommentContainer.appendChild(clone);
  });
}
async function apiGetLatestComments(limit) {
  const response = await fetch(`api/comment?limit=${limit}&postLink=home`);
  const comments = await response.json();
  return comments;
}
