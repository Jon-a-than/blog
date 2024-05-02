---
title: 集成 vue-router 路由模块
pubDate: 2023-10-27T12:25:00.000Z
description: mini SSR 路由模块集成
author: qingshaner
categories: [mini-ssr]
tags: [ssr]
weather: sunny
---

## 路由功能

一个 `Vue` 单页应用通常会使用 `vue-router` 来处理不同页面间的跳转, 同 `vue` 一样我们也要在 `Node.js` 服务端运行`vue-router`，所以也将 `vue-router` 安装到生产依赖中。

```bash
pnpm i vue-router -P
```

先写几个页面用于测试，注意 `RouterLink` 组件使用 `h` 函数会提示需要提供一个默认的插槽函数而不是字符串。

**关于页样式**

```css
/* src/views/about.module.css */
.title {
  color: #787;
}
```

**关于页**

```js
// src/views/AboutView.js
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'

import style from './about.module.css'

export default defineComponent(() => {
  return () =>
    h('div', [
      h('h2', { class: style.title }, 'About Page'),
      h(RouterLink, { to: { name: 'home' } }, () => 'Home'),
      h('p', article.value),
    ])
})
```

**首页**

```js
// src/views/HomeView.js
import { defineComponent, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent(() => {
  const count = ref(0)

  function handleAdd() {
    count.value++
    console.log('add', count.value)
  }

  return () =>
    h('div', [
      h('h2', 'Home Page'),
      h(RouterLink, { to: { name: 'about' } }, () => 'About'),
      h('p', `count: ${count.value}`),
      h('button', { onClick: handleAdd }, 'Add'),
    ])
})
```

**404 页**

```js
// src/views/NotFound.js
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent(() => {
  return () =>
    h('div', [
      h('h2', 'Not Found'),
      h(RouterLink, { to: { name: 'home' } }, () => 'Go Home'),
    ])
})
```

### 路由表

路由表配置同 `CSR` 模式配置相同, 路由懒加载也无需多余的配置，但路由模式在服务端因 `Node.js` 没有 `History API` 所以需要配置为内存模式。由于使用了 `vite` 作为打包工具，内置拓展了 `import.meta.env` 作为环境变量,使用其它工具可以自行在打包工具的类似 `define` 配置项中将环境变量指定为常量。
对于服务端路由模式 `createMemoryHistory` 若没有 `prerender` 的需求传与不传基础路径的效果是一样的。

```js
// src/router.js
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'

import HomeView from './views/HomeView'

/** @type {import('vue-router').RouteRecordRaw[]} */
const routes = [
  {
    path: '',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/AboutView'),
  },
  {
    path: '/:path(.*)*',
    component: () => import('./views/NotFound'),
  },
]

export default () => {
  return createRouter({
    // node 环境没有History API 所以在服务端使用内存模式
    history: import.meta.env.SSR
      ? createMemoryHistory(import.meta.env.BASE_URL)
      : createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
}
```

在根组件处导入路由插槽，并在初始化函数中导出路由与应用实例。导出的 `router` 用于在服务端将请求的 `url` 传给 `vue-router` 去处理需要渲染的组件。

```js
// src/App.js
import { createSSRApp, defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'

import createRouter from './router'

const App = defineComponent(() => {
  return () => h('div', null, [h('h1', 'Vue SSR App'), h(RouterView)])
})

export default () => {
  const app = createSSRApp(App),
    router = createRouter()

  app.use(router)

  return { app, router }
}
```

### 客户端入口

客户端的部分十分简单，`vue-router` 会自动工具当前路径进行路由的匹配，在注水前需要先等待路由解析完毕，否则会提示注水失败而回退到重新进行客户端渲染而造成额外的性能消耗。

```js
// src/entry-client.js
import createApp from './App'

startHydration()

/** @desc 基于服务端渲染的静态页集成Vue事件绑定，响应式状态等 */
async function startHydration() {
  const { app, router } = createApp()

  await router.isReady()
  app.mount('#app')

  console.log('hydration success')
}
```

### 服务端入口

在服务端我们需要将请求路径传给 `vue-router` 去处理，另外若路由配置了 `base` 则还需要将请求的 `url` 前缀给除去。另外重构一下 `render` 函数，改为接受请求路径来渲染。

```js
// src/entry-server.js
// ... 压缩一下

startServer()

/** @desc 启动服务器 */
function startServer() {
  const server = createServer(async ({ url = '/', method }, res) => {
    url = url.replace(import.meta.env.BASE_URL, '/')

    if (extname(url) !== '' && method === 'GET') {
      staticService(url, res)
    } else {
      const page = await render(url)
      res.end(page)
    }
  })

  server.listen(4936, () => console.log('Listening http://localhost:4936'))
  server.on('error', (e) => {
    // @ts-ignore
    e.code === 'EADDRINUSE' && console.error('host: 3000 is used')
  })
}

/**
 * @desc 服务端渲染组件并拼接为HTML
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function render(url) {
  const { app, router } = createApp()

  await router.push(url)
  await router.isReady()

  const appHtml = await renderToString(app)

  return template.replace('<!-- App Slot -->', appHtml)
}

/**
 * @desc 静态资源服务
 * @param {string} filePath 文件路径
 * @param {import('node:http').ServerResponse} res
 */
async function staticService(filePath, res) {
  /* ... */
}
```

大功告成，`pnpm dev` 后打开浏览器 `localhost:4936`，即可看到路由功能可以正常使用了。
