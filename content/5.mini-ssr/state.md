---
title: 实现迷你SSR - C/S状态同步
categories: [mini-ssr]
tags: [SSR, Vue]
description: 虽然 pinia 在 SPA 中比较鸡肋，但在服务端渲染中还是能帮我们解决很多问题的（但 Nuxtjs 提供了 useState ）。先不用 pinia ，尝试一下全局状态的设置，看看会有什么问题，新建 useCountStore 用全局响应式变量的方式创建全局状态。
---


## 使用全局响应式变量
虽然`pinia`在 SPA 中比较鸡肋，但在服务端渲染中还是能帮我们解决很多问题的（但 `Nuxtjs` 提供了 `useState` ）。先不用`pinia`，尝试一下全局状态的设置，看看会有什么问题，新建`useCountStore`用全局响应式变量的方式创建全局状态。
```javascript
import { computed, ref } from 'vue'

const count = ref(1)

export function useCountStore() {
  const doubleCount = computed(() => count.value * 2)

  function handleAdd() {
    count.value++
  }

  return {
    count,
    doubleCount,

    handleAdd,
  }
}

```

将`HomeView.js`的计数器改造一下，另外也在`AboutView.js`也引用一下验证全局状态的功能。
```javascript
import { defineComponent, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { useCountStore } from '../stores/count'

export default defineComponent(() => {
  const { count, handleAdd } = useCountStore()

  return () =>
    h('div', [
      h('h2', 'Home Page'),
      h(RouterLink, { to: { name: 'about' } }, () => 'About'),
      h('p', `count: ${count.value}`),
      h('button', { onClick: handleAdd }, 'Add'),
    ])
})

```
```javascript
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'

import { useCountStore } from '../stores/count'

import style from './about.module.css'

export default defineComponent(() => {
  const { doubleCount } = useCountStore()

  return () =>
    h('div', [
      h('h2', { class: style.title }, 'About Page'),
      h(RouterLink, { to: { name: 'home' } }, () => 'Home'),
      h('p', doubleCount.value),
    ])
})

```
现在重启一下服务端，可以看到全局状态都能够正常使用。

但这样的实现在`CSR`应用中没有什么问题，但在服务端由于使用了全局变量而导致该状态会在服务端的所有请求间共享而导致之前有提到的跨请求状态污染，同时全局变量也可能导致服务端内存泄露问题，使服务器无法长时间运行。

上面的例子之所以没有问题是因为我们没有在服务端去改变全局变量的状态。若我们在每次渲染`HomeView`时都执行一次加一操作，在刷新时就会看到计数器次数会有一下闪动，同时控制台会显示客户端激活失败（因为客户端与服务端全局变量`count`的初始值不一样了）。

```javascript
import { defineComponent, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { useCountStore } from '../stores/count'

export default defineComponent(() => {
  const { count, handleAdd } = useCountStore()

  handleAdd()

  return () =>
    h('div', [
      h('h2', 'Home Page'),
      h(RouterLink, { to: { name: 'about' } }, () => 'About'),
      h('p', `count: ${count.value}`),
      h('button', { onClick: handleAdd }, 'Add'),
    ])
})

```

## 使用Pinia
因为上面的问题，所以我们不能直接使用全局变量，还需要使用闭包来创建全局状态，使每次请求都创建一个新的状态。这时候我们可以直接使用`pinia`了，同样的将`pinia`安装到生产依赖。

```bash
pnpm i pinia -P
```

> 只要你只在 `setup` 函数、`getter` 和 `action` 的顶部调用你定义的 `useStore()` 函数，那么使用 Pinia 创建 store 对于 SSR 来说应该是开箱即用的。

将之前的`countStore`使用 Pinia 稍稍重构一下，在`HomeView`与`AboutView`的代码也改为使用 Pinia<br />为节约篇幅就不贴代码了。
```javascript
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCountStore = defineStore('count', () => {
  const count = ref(2)
  const doubleCount = computed(() => count.value * 2)

  function handleAdd() {
    count.value++
  }

  return {
    count,
    doubleCount,

    handleAdd,
  }
})

```
另外，同 SPA 应用一样，别忘了在 Vue 实例上加入 Pinia 插件。
```javascript
import { createSSRApp, defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'
import { createPinia } from 'pinia'

import createRouter from './router'

const App = defineComponent(() => {
  return () => h('div', null, [h('h1', 'Vue SSR App'), h(RouterView)])
})

export default () => {
  const app = createSSRApp(App),
    router = createRouter(),
    pinia = createPinia()

  app.use(pinia).use(router)

  return { app, router, pinia }
}

```

## 同步状态初始化
我们有时候需要在 (在下面的数据预取有应用) 服务端根据 `API` 更改 Pinia 的`state`，但这样就出现了问题，服务端的状态无法与客户端同步，这样就会使客户端激活（`hydration`）失败, 所以我们需要在客户端与服务端直接搭建一座桥梁使初始数据同步， 在 Pinia 文档中也称其为激活。

> 为了激活初始 state，你需要确保 rootState 包含在 HTML 中的某个地方，以便 Pinia 稍后能够接收到它。根据你服务端所渲染的内容，**为了安全你应该转义 state**。我们推荐 Nuxt.js 目前使用的 [@nuxt/devalue](https://github.com/nuxt-contrib/devalue)


目前主流的解决方案是将 Pinia 的 `state` 在服务端初始化完成后序列化为字符串放在 DOM 的`script`标签注册一个全局变量中，然后在客户端加载时从全局变量中取出初始化值反序列化。但用户可以在浏览器中修改 `script` 中的内容这就可能产生 XSS 攻击了，所以在序列化和反序列化时要对非法字符进行转义。

下面来实现一下这种效果，我们将 `count`初始值在服务端初始化为一个随机数，这样，客户端与服务端的数据就不是同步的了，若我们重启一下`pnpm dev`,打开浏览器就会看到控制台提示 SSR 激活失败。因为状态不一样，所以会退回到 CSR 。
```javascript
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCountStore = defineStore('count', () => {
  const count = ref(1)
  if (import.meta.env.SSR) {
    count.value = Math.random()
  }
  
  const doubleCount = computed(() => count.value * 2)
  function handleAdd() {/* ... */}
  return { /* ... */}
})

```

现在我们使用`window.__PINIA`来实现数据同步，这里为了方便使用`JSON.stringify / JSON.parse`来实现序列化与序列化，生产环境因使用更安全的库来实现（如`@nuxt/devalue`）。

先在`index.html`中加一个占位符，用于填充初始化数据。
```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini SSR</title>
    <script type="module" src="src/entry-client.js" ></script>    
    <!-- Head Slot -->
  </head>
  <body>
    <div id="app"><!-- App Slot --></div>
    <!-- State Slot -->
  </body>
</html>

```

在服务端渲染完成后将 Pinia 的状态保存下来，这里用了两层`JSON.stringify`是因为拼接时会把最外层的引号去掉，直接补引号会有问题 (如``'${{"a": "'"}}'` => '{"a": "'"}'`, 单引号多次出现而错误)

```javascript
// ...

/**
 * @desc 服务端渲染组件并拼接为HTML
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function render(url) {
  const { app, router, pinia } = createApp()

  await router.push(url)
  await router.isReady()

  const appHtml = await renderToString(app)

  return template
    .replace('<!-- App Slot -->', appHtml)
    .replace(
      '<!-- State Slot -->',
      `<script>window.__PINIA=JSON.stringify(${JSON.stringify(
        pinia.state.value
      )})</script>`
    )
}
// ...
```

然后在客户端代码入口处判断是客户端则将 Pinia 初始值进行更新。若使用了`JSDoc`检查或`TS`别忘了拓展一下`window`的类型。
```typescript
/// <reference types="vite/client" />

declare interface Window {
  __PINIA: string
}
```

```javascript
import createApp from './App'

startHydration()

/** @desc 基于服务端渲染的静态页集成Vue事件绑定，响应式状态等 */
async function startHydration() {
  const { app, router, pinia } = createApp()

  const state = JSON.parse(window.__PINIA)
  pinia.state.value = state

  await router.isReady()
  app.mount('#app')

  console.log('hydration success')
}

```

现在重启`pnpm dev`后浏览器打开`localhost:4936`可以看到 `count` 值已经有了随机数的小数部分，但控制台依然提示服务端与客户端渲染不匹配，但直接打开`localhost:4936/about`是正常的。

原因是我们的 `HomeView`中的的`countStore.handleAdd`, 在服务端运行后 `count = 1.xxxx`, 该值被保存下来，客户端的初始值`count = 1.xxxx`,在执行加一操作后 `count = 2.xxxx`就与服务端渲染结果不一致了。
```javascript
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'

import { useCountStore } from '../stores/count'

export default defineComponent(() => {
  const countStore = useCountStore()

  countStore.handleAdd()

  return () =>
    h('div', [
      h('h2', 'Home Page'),
      h(RouterLink, { to: { name: 'about' } }, () => 'About'),
      h('p', `count: ${countStore.count}`),
      h('button', { onClick: countStore.handleAdd }, 'Add'),
    ])
})

```

我们把它改成服务端友好的代码, 改成像下面这样后客户端就不会激活失败了（因为服务端只会执行`onServerPrefetch`(`serverPrefect`) ，`setup`(`created`和`beforeCreated`)这几个生命周期钩子，所以客户端也在这个时侯去匹配）。
```javascript
// ...

export default defineComponent(() => {
  const countStore = useCountStore()

  if (import.meta.env.SSR) {
    countStore.handleAdd()
  }

  onMounted(countStore.handleAdd)

  // ...
})

```

但 `count` 还是等于`2.xxxx`,而且加载的时候会有`1.xxxx`到`2.xxxx`的闪烁，体验极差。这个问题，我还没有找到好的解决方案，只能通过丑陋的方式修复一下。。。这也算是 SSR 的一种劣势，需要去关注服务端与客户端的初始化问题。
```javascript
import { defineComponent, h, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import { useCountStore } from '../stores/count'

export default defineComponent(() => {
  const countStore = useCountStore()

  if (import.meta.env.SSR) {
    countStore.handleAdd()
  }
  onMounted(() => {
    !countStore.countLock && countStore.handleAdd()
    countStore.countLock = false
  })

  return () =>
    h('div', [
      h('h2', 'Home Page'),
      h(RouterLink, { to: { name: 'about' } }, () => 'About'),
      h('p', `count: ${countStore.count}`),
      h('button', { onClick: countStore.handleAdd }, 'Add'),
    ])
})

```
```javascript
import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'

export const useCountStore = defineStore('count', () => {
  const count = ref(1)
  const countLock = ref(true)

  if (import.meta.env.SSR) {
    count.value = Math.random()
  }

  const doubleCount = computed(() => count.value * 2)

  function handleAdd() {
    count.value++
  }

  return {
    count,
    countLock,
    doubleCount,

    handleAdd,
  }
})

```

