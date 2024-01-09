import { s as serviceWorkerPromise } from "./index-5ozU-LZv.js";
function getCurrentPostLink(pathname) {
  var _a;
  if (pathname.startsWith("/21081715/dist/")) {
    pathname = pathname.slice("/21081715/dist/".length - 1);
  }
  if (pathname.startsWith("/21081715")) {
    pathname = pathname.slice("/21081715".length);
  }
  const path = pathname.split("/");
  if (path.at(-1) === "") {
    if (path.length <= 2) {
      return "/index";
    } else if ((_a = path.at(-2)) == null ? void 0 : _a.endsWith(".html")) {
      return path.slice(0, -1).join("/").slice(0, -5);
    } else {
      return path.join("/") + "index";
    }
  }
  const postLink = path.join("/");
  return postLink.endsWith(".html") ? postLink.slice(0, -5) : postLink;
}
const COMMENT_TEXTAREA = document.querySelector("#comment-textarea");
const COMMENT_NICKNAME = document.querySelector("#comment-nickname");
const COMMENT_SUBMIT = document.querySelector("#comment-submit");
const POST_COMMENT_TEMPLATE = document.querySelector("#postComment");
const COMMENT_FORM = document.querySelector("#comment");
async function renderComments() {
  const res = await fetch(
    `/api/comment?limit=100&postLink=${getCurrentPostLink(location.pathname)}`
  );
  const comments = await res.json();
  const commentContainer = document.querySelector("#comment-container");
  commentContainer.innerHTML = "";
  comments.forEach(({ author, comment, position, date }) => {
    const template = document.importNode(POST_COMMENT_TEMPLATE.content, true);
    template.querySelector('[data-type="author"]').textContent = author;
    template.querySelector('[data-type="comment"]').textContent = comment;
    template.querySelector('[data-type="position"]').textContent = position;
    template.querySelector('[data-type="time"]').textContent = new Date(date).toLocaleString(
      "zh-CN"
    );
    commentContainer.appendChild(template);
  });
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
  await res.json();
  renderComments();
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
function renderToc() {
  const AnchorList = document.querySelectorAll(".h2, .h3");
  renderTocList(AnchorList);
  bindToc(AnchorList);
}
function renderTocList(AnchorList) {
  const TOC_CONTAINER = document.querySelector("#tocContainer");
  const TOC_ITEM_TEMPLATE = document.querySelector("#tocItem");
  const ANCHOR = TOC_ITEM_TEMPLATE.content.querySelector("a");
  AnchorList.forEach((anchor) => {
    ANCHOR.textContent = decodeURI(anchor.id);
    ANCHOR.href = `#${anchor.id}`;
    if (anchor.classList.contains("h3")) {
      ANCHOR.classList.add("ml-1em");
    } else {
      ANCHOR.classList.remove("ml-1em");
    }
    const template = document.importNode(TOC_ITEM_TEMPLATE.content, true);
    TOC_CONTAINER.appendChild(template);
  });
}
function bindToc(AnchorList) {
  const TOC_LIST = document.querySelectorAll("#tocContainer > li");
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries.every(({ isIntersecting }) => !isIntersecting))
        return;
      let flag = false;
      TOC_LIST.forEach((li) => {
        const hash = li.children[0].hash;
        if (flag || entries.every(({ target, isIntersecting }) => !isIntersecting || hash !== `#${target.id}`)) {
          li.classList.remove("text-rose-3", "before:bg-rose-3");
        } else {
          flag = true;
          li.classList.add("text-rose-3", "before:bg-rose-3");
        }
      });
    },
    {
      rootMargin: "-10px",
      threshold: 1
    }
  );
  AnchorList.forEach((anchor) => {
    intersectionObserver.observe(anchor);
  });
}
const posts = [
  {
    meta: {
      title: "实现迷你SSR - 组件服务端渲染",
      categories: [
        "mini-ssr"
      ],
      tags: [
        "SSR",
        "Vue"
      ],
      description: "由于 Nuxtjs 等元框架的使用，一直好奇于 SSR 的实现原理，所以决定使用最少的依赖（排雷：无 Express，了解 h 函数的使用）尝试实现一下 Vue3 的服务端渲染。"
    },
    path: "F:\\后会无期\\Web开发作业\\content/5.mini-ssr/base.md",
    link: "posts/mini-ssr/base.html",
    updatedAt: "2023-12-01 20:06:31 +0800",
    createdAt: "2023-12-01 20:06:31 +0800"
  },
  {
    meta: {
      title: "实现迷你SSR - 服务端数据预取",
      categories: [
        "mini-ssr"
      ],
      tags: [
        "SSR",
        "Vue"
      ],
      description: "数据预取是指在服务端就对所需要的 API 请求数据完成，在服务端直接将请求数据渲染出来，服务端的请求一般都快于用户端(特别在后端部署在同一服务器，或直接使用该应用 node.js 服务端的 api 服务时)，可以获得更好的用户体验和 SEO 效果。"
    },
    path: "F:\\后会无期\\Web开发作业\\content/5.mini-ssr/prefetch.md",
    link: "posts/mini-ssr/prefetch.html",
    updatedAt: "2023-12-01 20:06:31 +0800",
    createdAt: "2023-12-01 20:06:31 +0800"
  },
  {
    meta: {
      title: "实现迷你SSR - 添加路由模块",
      categories: [
        "mini-ssr"
      ],
      tags: [
        "SSR",
        "Vue"
      ],
      description: "一个 Vue 单页应用通常会使用 vue-router 来处理不同页面间的跳转, 服务端也需要使用它来选择路径所需渲染的组件。"
    },
    path: "F:\\后会无期\\Web开发作业\\content/5.mini-ssr/router.md",
    link: "posts/mini-ssr/router.html",
    updatedAt: "2023-12-01 20:06:31 +0800",
    createdAt: "2023-12-01 20:06:31 +0800"
  },
  {
    meta: {
      title: "实现迷你SSR - C/S状态同步",
      categories: [
        "mini-ssr"
      ],
      tags: [
        "SSR",
        "Vue"
      ],
      description: "虽然 pinia 在 SPA 中比较鸡肋，但在服务端渲染中还是能帮我们解决很多问题的（但 Nuxtjs 提供了 useState ）。先不用 pinia ，尝试一下全局状态的设置，看看会有什么问题，新建 useCountStore 用全局响应式变量的方式创建全局状态。"
    },
    path: "F:\\后会无期\\Web开发作业\\content/5.mini-ssr/state.md",
    link: "posts/mini-ssr/state.html",
    updatedAt: "2023-12-01 20:06:31 +0800",
    createdAt: "2023-12-01 20:06:31 +0800"
  },
  {
    meta: {
      title: "Markdown渲染预览",
      description: "Markdown渲染结果预览",
      tags: [
        "markdown",
        "test"
      ],
      category: [
        "markdown"
      ]
    },
    path: "F:\\后会无期\\Web开发作业\\content/markdown.md",
    link: "posts/markdown.html",
    updatedAt: "2023-12-05 18:04:50 +0800",
    createdAt: "2023-12-05 18:04:50 +0800"
  }
];
function renderRecommendPost() {
  const relatedPosts = getRelatedPosts();
  const RecommendPostItemTemplate = document.getElementById(
    "recommendPostItem"
  );
  const ANCHOR = RecommendPostItemTemplate.content.querySelector("a");
  const MENU_CONTAINER = document.getElementById("recommendPostContainer");
  relatedPosts.forEach(([title, link]) => {
    ANCHOR.textContent = title;
    ANCHOR.href = `${"/21081715/dist/"}${link}`;
    const template = document.importNode(RecommendPostItemTemplate.content, true);
    MENU_CONTAINER.appendChild(template);
  });
}
function getRelatedPosts() {
  const currentPostLink = getCurrentPostLink(location.pathname).slice(1);
  const linkTokens = currentPostLink.split("/");
  const prefix = linkTokens.slice(0, -1).join("/");
  return posts.filter(({ link }) => {
    if (`${currentPostLink}.html` === link)
      return false;
    return link.startsWith(prefix) && link.split("/").length === linkTokens.length;
  }).map(({ link, meta }) => {
    return [meta.title, link];
  });
}
renderToc();
renderRecommendPost();
serviceWorkerPromise.then(renderComments);
