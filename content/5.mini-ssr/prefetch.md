---
title: 实现迷你SSR - 服务端数据预取
categories: [mini-ssr]
tags: [SSR, Vue]
description: 数据预取是指在服务端就对所需要的 API 请求数据完成，在服务端直接将请求数据渲染出来，服务端的请求一般都快于用户端(特别在后端部署在同一服务器，或直接使用该应用 node.js 服务端的 api 服务时)，可以获得更好的用户体验和 SEO 效果。
---


数据预取是指在服务端就对所需要的`API`请求数据完成，在服务端直接将请求数据渲染出来，服务端的请求一般都快于用户端(特别在后端部署在同一服务器，或直接使用该应用`node.js`服务端的`api`服务时)，可以获得更好的用户体验和 SEO 效果。

`Vue`给组合式写法直接提供了`onServerPrefetch`的生命周期钩子用于服务端数据预取（也有对应的选项式生命周期`serverPrefetch`），`renderToString`会等待该函数运行完成后再进行组件的渲染工作。数据预取对 SEO 虽好，但会加大服务端的压力，若数据对 SEO 影响较小或非关键信息，可以放在`onMounted`钩子中执行, 因为服务端只会执行`onServerPrefetch`(`serverPrefect`) ，`setup`(`created`和`beforeCreated`)这几个生命周期钩子，这样可以将请求数据处理的压力分摊到客户端处理。

不过该生命周期只在服务端渲染时存在，所以当是在客户端动态生成该组件时(如客户端从其它路由跳转到的路由组件有使用该生命周期，这时不会请求服务端来渲染组件)，还需要使用`onMounted`钩子来判断是否需要请求数据，若已经有数据则直接使用服务端的数据，反之则发起请求，若父组件是`Suspense`则相关代码可以都放在`setup`中而不使用`onMounted`和`serverPrefetch`。

## 服务端预取
在服务端进行视图渲染前进行数据请求, 需要同步数据。所使用的响应式变量应定义在 Pinia 中而不是直接在组件中定义并使用，这样可以使用上文的方法统一进行数据同步而无需为每一个组件都添加数据同步的逻辑。若不使用响应式变量存储而使用普通变量，可以实现服务端渲染与客户端`hydration`, 但该方法无法在客户端路由导航时获取数据（客户端导航不请求服务端，普通变量没有响应式无法在客户端更新 DOM，若父组件使用 `Suspense`可在 setup 顶层使用 await 解决，否则因使用响应式变量，当然也可使用 MPA 的预渲染全都请求服务端的渲染结果）。
```javascript
export defineComponent(() => {
	// let article = '' ❌ 不支持客户端路由
  // const article = ref('') ❌ 数据同步麻烦
  const articleStore = useArticleStore() // ✅

	onServerPrefetch(async () => await articleStore.prefetch())

  return h('p', articleStore.article)
})
```

定义一个 api 接口, 并在`entry-server.js`中对请求方法与路径进行过滤，若请求路径有拓展符且为 GET 请求则为静态资源请求，若请求路径以`/api`开头则判定为`API`请求，都不匹配则交给 VueRouter 处理并返回服务端渲染结果。

```javascript
/**
 * @desc api 请求
 * @param {string} url 
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string} method 
 * @param {import('node:http').IncomingMessage} req
 */
export function apiHandler(url, method = 'GET', req) {
  return 'this is article'
}
```
```javascript
import { apiHandler } from './apis' 
// ...

/** @desc 启动服务器 */
function startServer() {
  const server = createServer(async (req, res) => {
    const url = req.url?.replace(import.meta.env.BASE_URL, '/') ?? '/'
    const method = req.method || 'GET'
    console.log(url)

    if (extname(url) !== '' && method === 'GET') {
      staticService(url, res)
    } else if (url.startsWith('/api')) {
      res.end(apiHandler(url, method, req))
    } else {
      const page = await render(url)
      res.end(page)
    }
  })

  // ...
```

编写 `useArticleStore` 存储请求结果, 这里可以使用环境变量的方式来管理 api 根路径，不能直接使用`/api`,`/api/article`的请求路径，因为不止在客户端会发送请求，服务端也要调用，而服务端不会自动添加请求路径`BaseURL`。
```javascript
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', () => {
  const article = ref('')
  
  async function getArticle() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/article`)
    article.value = await res.text()
  }

  return {
    article,
    getArticle
  }
})

```

## 客户端激活
客户端激活处理由 Pinia 的数据同步托管。
