import { g as getCurrentPostLink } from "./index-MQVGeJDe.js";
const COMMENT_TEXTAREA = document.querySelector("#comment-textarea");
const COMMENT_NICKNAME = document.querySelector("#comment-nickname");
const COMMENT_SUBMIT = document.querySelector("#comment-submit");
const COMMENT_FORM = document.querySelector("#comment");
setTimeout(renderComments, 500);
async function renderComments() {
  const res = await fetch("/api/comment?limit=100");
  const comments = await res.json();
  console.log(comments);
  const commentList = comments.reduce((acc, comment) => acc + commentTemplate(comment), "");
  const commentContainer = document.querySelector("#comment-container");
  commentContainer.innerHTML = commentList;
}
async function addComment(comment, author) {
  if (!comment || !author)
    return;
  const res = await fetch("/api/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      author,
      comment,
      postLink: getCurrentPostLink(location.pathname)
    })
  });
  COMMENT_FORM.reset();
  const newComment = await res.json();
  console.log(newComment);
}
COMMENT_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const comment = e.target[0].value.trim();
  const nickname = e.target[1].value.trim();
  await addComment(comment, nickname);
});
COMMENT_SUBMIT.addEventListener("click", async () => {
  const comment = COMMENT_TEXTAREA.value.trim();
  const nickname = COMMENT_NICKNAME.value.trim();
  await addComment(comment, nickname);
});
function commentTemplate(comment) {
  return `
<div class="flex items-start gap-4">
  <p class="flex flex-col items-center justify-center">
    <span class="font-bold after:content-[':']">${comment.author}</span>
  </p>
  <p class="flex flex-1 flex-col bg-primary-3 dark:bg-primary-6 rounded pa-2">
    <span>${comment.comment}</span>
    <span class="ml-auto text-sm text-primary-5 dark:text-primary-2">
      ${comment.position}
      <time>${new Date(comment.date).toLocaleString("zh-CN")}</time>
    </span>
  </p>
</div>`;
}
parseMenu();
function parseMenu() {
  const anchorList = document.querySelectorAll(".anchor");
  const menu = [];
  anchorList.forEach(({ href, name }) => menu.push({ href, name }));
  console.log(menu);
}
