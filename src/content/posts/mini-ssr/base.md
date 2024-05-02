---
title: 极简实现服务端组件渲染
pubDate: 2023-10-25T13:40:00.000Z
description: mini SSR 的基本功能
author: qingshaner
categories: [mini-ssr]
tags: [ssr]
weather: cloudy
---

## 极简 SSR

[![语雀文档](https://img.shields.io/badge/docs-%F0%9F%90%A4_%E8%AF%AD%E9%9B%80-%2328BE5E)](https://www.yuque.com/yuqueyonghutveb5n/frontend/dtntdtb0vgzbqy8m?singleDoc)

由于 Nuxtjs 等元框架的使用，一直好奇于 SSR 的实现原理，所以决定使用最少的依赖（无 Express ）实现一下 Vue3 的服务端渲染。

Node.js 在 `v21.1.0` 更新了 ESM 的判断规则，可以直接引入 ESM 而不需要添加烦人的 .js 后缀了(手里的 Node.js 20 才用几天就不香了)，若使用 Node.js `v21+` 下文的 entry-server.js 可以尝试修改一下实现不打包而直接运行了并且可以使用 `node` 自带的 `watch` 命令，前提是不使用 SFC 。

- `Node.js >= 18.0.0` (支持 `fetch API` )
- `Vue >= 3.2`
- `VueRouter >= 4.0`
- `Pinia >= 2.0`

## 目标清单

- ✅ [组件渲染](https://github.com/Jon-a-than/vue3-ssr-mini/tree/v0.0.1)
- ✅ [路由功能](https://github.com/Jon-a-than/vue3-ssr-mini/tree/v0.0.2)
- ✅ [状态管理](https://github.com/Jon-a-than/vue3-ssr-mini/tree/v0.0.3)
- 🚧 数据预取

## 目录

- [依赖](#依赖)
- [Node.js 渲染 ue 组件](#Node.js渲染ue组件)
  - [拼接 HTML 页面](#拼接-html-页面)
- [构建服务端](#构建服务端)
- [客户端激活](#客户端激活)
  - [Hydration](#hydration)
- [静态资源服务](#静态资源服务)
  - [引入客户端入口文件](#引入客户端入口文件)
  - [CSS 与图片资源](#css-与图片资源)
  - [资源 preload(🚧WIP)](#资源-preload🚧wip)
- [路由功能](#路由功能)
  - [路由表](#路由表)
  - [客户端入口](#客户端入口)
  - [服务端入口](#服务端入口)
- [全局状态管理](#全局状态管理)
  - [使用全局响应式变量](#使用全局响应式变量)
  - [使用 Pinia](#使用pinia)
  - [同步状态初始化](#同步状态初始化)

## 依赖

`Vue3`服务端渲染最重要的依赖是`vue`与`@vue/server-renderer`, `@vue/server-renderer`用于将组件在服务端渲染为 html 字符串，从而拼接到`html`中，不过`@vue/server-renderer`已经在`vue`包中内置了所以不必单独安装 :p。

```bash
pnpm i vue -P
```

## Node.js 渲染 Vue 组件

组件渲染
既然要最简实现，所以使用 h 函数来创建 Vue 组件而并不是单文件组件。
先创建`entry-server.js`(该文件名已成约定)来看看`renderToString`这个函数的功能。

```js
// src/entry-server.js
import { h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const app = h('h1', 'Hello world!')

const AppString = await renderToString(app)

console.log(AppString) // <h1>Hello World!</h1>
```

`package.json`编写一下运行脚本, 执行`pnpm dev:server`即可看到`<h1>Hello World!</h1>`的结果。这么神奇! 那我们把字符串插入到 `HTML` 模板中岂不就完成了服务端渲染，页面静态生成好像也是一步之遥。

```json
{
  "type": "module",
  "scripts": {
    "dev:server": "node ./src/entry-server.js"
  },
  "dependencies": {
    "vue": "^3.3.7"
  }
}
```

**由于使用的是 ESM，要记得在`package.json`中添加`"type": "module"`**

### 拼接 HTML 页面

先在根目录创建一个`index.html`文件作为页面模板, 使用`<!-- App Slot -->`作为占位字符串，待会儿就把它替换为组件的`html`字符串。

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini SSR</title>
  </head>
  <body>
    <div id="app"><!-- App Slot --></div>
  </body>
</html>
```

由于要写`node.js`，所以最好也安装一下`@types/node`以增强类型提示(非必要)。

```bash
pnpm i @types/node -D
```

```js
// src/entry-server.js
import { h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const component = h('h1', 'Hello World!')

console.log(await render(component))

/**
 * @param {import('vue').App<any> | import('vue').VNode} root
 * @returns {Promise<string>}
 */
async function render(root) {
  const TemplatePath = fileURLToPath(new URL('../index.html', import.meta.url))

  const template = await readFile(TemplatePath, { encoding: 'utf-8' })
  const app = await renderToString(root)

  return template.replace('<!-- App Slot -->', app)
}
```

`pnpm dev:server`运行后在控制台得到输出。

```bash
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini SSR</title>
  </head>
  <body>
    <div id="app"><h1>Hello World!</h1></div>
  </body>
</html>
```

## 构建服务端

在`entry-server.js`中启动一个`node`服务器，用于响应请求。
服务端开启后返回拼接后的`html`页面, 直接`curl localhost:4936`后返回了拼接后的 `html` 页面，至此就实现了服务端渲染功能。这里的 `render` 函数中读取`index.html`的步骤可以将其改为全局常量，这样就不需要每次请求都进行文件的读取，可以优化首屏渲染时间和服务器资源消耗。

```js
// src/entry-server.js
import { createServer } from 'node:http'

// 避免重复读取html模板
const TemplatePath = fileURLToPath(new URL('../index.html', import.meta.url))
const template = await readFile(TemplatePath, { encoding: 'utf-8' })

const component = h('h1', 'Hello World!')

startServer()

/** @desc 启动服务器 */
function startServer() {
  const server = createServer(async (req, res) => {
    const page = await render(component)

    res.end(page)
  })

  server.listen(4936, () => console.log('Listening http://localhost:4936'))
  server.on('error', (e) => {
    e.code === 'EADDRINUSE' && console.error('port: 4936 is used')
  })
}

async function render(root) {
  /* ... */
}
```

此时浏览器访问 `localhost:4936` 即可看到 `Hello World!`

## 客户端激活

现在我们的页面有 `html` 元素，没有 `css` 或 `js`。我们先创建一个包含状态和事件的计数器组件。

```js
// src/App.js
import { defineComponent, h, ref } from 'vue'

const Counter = defineComponent(() => {
  const count = ref(0)

  function handleAdd() {
    count.value++
    console.log('add', count.value)
  }

  return () =>
    h('div', [
      h('p', `count: ${count.value}`),
      h('button', { onClick: handleAdd }, 'Add')
    ])
})

export default Counter
```

```js
// src/entry-server.js
// import ...
import Counter from './App.js'

const component = h(Counter)

startServer()
/** @desc 启动服务器 */
function startServer() {
  /* ... */
}

/** @desc 渲染并拼接 HTML */
async function render(root) {
  /* ... */
}
```

现在将 `entry-server.js` 中渲染的组件改为计数器组件后再次重启服务端（注意这里由于目前是直接给 `Node.js` 运行的 `esm` 模块，所以在导入模块时需要添加文件后缀），打开浏览器打开 `localhost:4936` 可以看到页面已经正常渲染了，但点击按钮却没有任何效果。

### Hydration

现在我们需要给客户端的静态页面绑定事件，和响应式数据，这一步官方称为水合或客户端激活(`hydration`)。当然我们可以直接在客户端使用 `createApp` 重新渲染一个 `CSR` 应用，不过 `Vue` 提供了 `createSSRApp` 方法专门用于客户端激活，同 `createApp` 一样会返回一个包含 `mount` 方法的对象，用于在客户端挂载到应用的根元素上。我们将默认导出改为使用 `createSSRApp` 创建应用而不是直接导出组件。

```js
// src/App.js
import { createSSRApp, defineComponent, h, ref } from 'vue'

const Counter = defineComponent(() => {
  /* ... */
})

export default () => createSSRApp(Counter)
```

创建需要在浏览器中运行的激活函数。

```js
// src/entry-client.js
import createApp from './App'

startHydration()

/** @desc 基于服务端渲染的静态页集成 Vue 事件绑定，响应式状态等 */
function startHydration() {
  const app = createApp()

  app.mount('#app')

  console.log('hydration success')
}
```

我们还需要打包一下 `entry-client.js` 将 `Vue` 打包入该文件，当然使用 `CDN` 的方式导入也可以。这里使用 `esbuild` 打包。

```bash
pnpm i esbuild -D
```

```js
// scripts/build.js
import { build } from 'esbuild'

import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

buildEntryClient()

function buildEntryClient() {
  const RootDir = fileURLToPath(new URL('..', import.meta.url))

  build({
    bundle: true,
    format: 'esm',
    target: ['es2022'],
    platform: 'browser',
    entryPoints: [resolve(RootDir, 'src/entry-client.js')],
    outfile: resolve(RootDir, 'dist/entry-client.js'),
    define: {
      'process.env.NODE_ENV': '"production"',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_OPTIONS_API__: 'false'
    }
  })
}
```

添加一下 `package.json` 的脚本,执行一下 `pnpm build:client` 即可看到已经将 `entry-client.js` 打包在 `dist` 目录下了。

```json
{
  "type": "module",
  "scripts": {
    "build:client": "node ./scripts/build.js",
    "dev:server": "pnpm build:client && node ./src/entry-server.js"
  },
  "dependencies": {
    "vue": "^3.3.7"
  },
  "devDependencies": {
    "@types/node": "^20.8.8",
    "esbuild": "^0.19.5"
  }
}
```

## 静态资源服务

### 引入客户端入口文件

现在在我们的 `index.html` 中引入客户端激活脚本 `dist/entry-client.js`，记得要添加 `type="module"` 属性，或者将其移到 `div#app` 元素下方 (确保 `app.mount('#app')`脚本运行时元素已经存在)。

顺带一笔，刚开始打算直接把 `dist/entry-client.js` 中的内容拼接到 `html` 的 `script` 标签内，但这加大了网页爬虫的加载时间，若拼接在 `html` 内，则使用 `curl` 访问时会将 `javascript` 文件也拉下来，而通过 `script` 的 `src` 方式导入则只仅会显示一个标签，爬虫可以更快的获取到页面。

但相应的客户端就要再次发起请求获取 `js` 了，在请求 `js` 期间不能处理页面的用户事件(在慢速 3G 的网络下慢了 2s 左右，但对于爬虫完成 `html` 请求快了 3.7s 左右)。

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini SSR</title>
    <script type="module" src="dist/entry-client.js"></script>
  </head>
  <body>
    <div id="app"><!-- App Slot --></div>
  </body>
</html>
```

浏览器会请求静态资源，此时就需要在服务端处理静态资源请求服务，若请求路径存在后缀则判定为请求静态资源，否则返回服务端渲染界面。至此就完成了基本的服务端渲染了，浏览器打开 `localhost:4936` 计数器正常渲染，并且 `vue` 也与客户端 `DOM` 绑定了响应式数据。

使用 `createSSRApp` 函数创建的实例不应该被重复使用，而应在每次响应时都创建一个新的实例，否则在第二次请求时会发出如下警告`[Vue warn]: App already provides property with key "Symbol(v-scx)". It will be overwritten with the new value.`

若还使用了路由与状态管理插件则可能会影响不同请求的渲染结果。官方文档：[跨请求状态污染](https://cn.vuejs.org/guide/scaling-up/ssr.html#cross-request-state-pollution)

```js
// src/entry-server.js
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import { readFile, stat } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { extname } from 'node:path'

import createApp from './App.js'

const TemplatePath = fileURLToPath(new URL('../index.html', import.meta.url))
const template = await readFile(TemplatePath, { encoding: 'utf-8' })

// const app = createApp()

startServer()

/** @desc 启动服务器 */
function startServer() {
  const server = createServer(async ({ url = '/' }, res) => {
    if (extname(url) !== '') {
      staticService(url, res)
    } else {
      const app = createApp()
      const page = await render(app)
      res.end(page)
    }
  })

  server.listen(4936, () => console.log('Listening http://localhost:4936'))
  server.on('error', (e) => {
    // @ts-ignore
    e.code === 'EADDRINUSE' && console.error('port: 4936 is used')
  })
}

/**
 * @param {import('vue').App<any> | import('vue').VNode} root
 * @returns {Promise<string>}
 */
async function render(root) {
  /* ... */
}

/**
 * @desc 静态资源服务
 * @param {string} filePath 文件路径
 * @param {import('node:http').ServerResponse} res
 */
async function staticService(filePath, res) {
  filePath = fileURLToPath(new URL(`..${filePath}`, import.meta.url))
  const extension = extname(filePath).slice(1)
  const contentType =
    {
      html: 'text/html;charset=UTF-8',
      js: 'text/javascript;charset=UTF-8',
      css: 'text/css;charset=UTF-8',
      png: 'image/png',
      jpg: 'image/jpeg',
      json: 'application/json;charset=UTF-8',
      ico: 'image/x-icon',
      svg: 'image/svg+xml'
    }[extension] ?? 'text/plain;charset=UTF-8'

  try {
    const fileStat = await stat(filePath)
    if (fileStat.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', contentType)
      createReadStream(filePath).pipe(res)
    }
  } catch (e) {
    res.statusCode = 404
    res.end()
  }
}
```

### CSS 与图片资源

原先打算为了轻量而不使用 `vite` 的，但 `esbuild` 的 `css` 打包 `spliting` 选项功能太少了，而且会在每个引入有 `css` 的组件的文件处都生成一份样式文件使打包结果比较混乱，在打包后生成的 `metafile` 中也难以精确的知道是哪个组件需要样式文件只能全局引入。

而 `rollup` 暂时不能开箱即用需要一些插件支持，所以还是决定使用 `vite` 来进行打包，所以，现在 `css` 与图片资源与使用 `vite` 的应用一样了都由 `vite` 来托管了 😅(包括动态的导入所需的静态资源也已经自动注入了 `profill` 与 `vitePreload` 函数来处理，这就是开箱即用的魅力吧)。`vite` 服务端热更新在官网文档有介绍，这里先只关注于服务端渲染的实现，所以没有处理开发环境，只处理生产环境，需要打包后再预览。

```bash
pnpm i vite -D
pnpm rm esbuild -D
```

下面是 `vite` 客户端打包配置，为了方便仓库打包产物，这里把 `target` 设为 `es2022` 并关闭产物压缩。

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    target: ['es2022'],
    minify: false
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: '[name]_[local]_[hash:5]'
    }
  }
})
```

将 `html` 引入的文件改为 `src/entry-client` 由 `vite` 控制打包后的资源请求目录。

```html
// index.html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <!-- ... -->
    <script type="module" src="src/entry-client.js"></script>
  </head>
  <body>
    <div id="app"><!-- App Slot --></div>
  </body>
</html>
```

由于 `node.js` 引入 `esm` 需要添加额外的 `.js` 后缀很麻烦，所以对 `entry-server.js` 也进行打包处理。新建一个单独的 `vite` 配置文件用于打包服务端入口文件，将打包产物放到 `dist/server` 目录下，如此 `entry-server.js` 与 `HTML` 目标的相对位置与源码目录一致。

```js
// vie.config.server.js
import clientConfig from './vite.config'
import { defineConfig, mergeConfig } from 'vite'

export default mergeConfig(
  clientConfig,
  defineConfig({
    build: {
      outDir: 'dist/server',
      ssr: 'src/entry-server.js',
      ssrManifest: true
    }
  })
)
```

配置一下 `package.json` 脚本, **注意要先打包 `client` ,再打包 `server` 否则 `vite` 会在生成客户端打包产物时把 `dist` 中的打包 `server` 目录清空**

```json
{
  "type": "module",
  "scripts": {
    "build": "pnpm build:client & pnpm build:server",
    "build:client": "vite build",
    "build:server": "vite build -c ./vite.config.server.js ",
    "dev": "pnpm build && node ./dist/server/entry-server.js",
    "preview": "node ./dist/server/entry-server.js"
  },
  "dependencies": {
    "vue": "^3.3.7"
  },
  "devDependencies": {
    "@types/node": "^20.8.9",
    "vite": "^4.5.0"
  }
}
```

重构一下 `entry-server.js` 的代码可以把 `.js` 后缀去除了。

```js
// import ...

// 可以把 `.js` 后缀去除了
import createApp from './App'

// ...
```

### 资源 preload（🚧WIP）

该部分与打包工具关联性较强，vite 默认在客户端打包产物中自动添加 preload 相关的 js 代码。
🚧WIP
