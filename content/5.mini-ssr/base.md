---
title: 实现迷你SSR - 组件服务端渲染
categories: [mini-ssr]
tags: [SSR, Vue]
description: 由于 Nuxtjs 等元框架的使用，一直好奇于 SSR 的实现原理，所以决定使用最少的依赖（排雷：无 Express，了解 h 函数的使用）尝试实现一下 Vue3 的服务端渲染。
---

![](https://img.shields.io/badge/docs-%F0%9F%90%A4_%E8%AF%AD%E9%9B%80-%2328BE5E#from=url&id=Gz3J1&originHeight=20&originWidth=82&originalType=binary&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&title=)

由于`Nuxtjs`等元框架的使用，一直好奇于`SSR`的实现原理，所以决定使用最少的依赖（排雷：无~~Express~~，了解`h`函数的使用）尝试实现一下`Vue3`的服务端渲染。<br />`Node.js 21.1.0`更新了`ESM`的判断规则，可以直接引入`ESM`而不需要添加烦人的`.js`后缀了(手里的`Node 20`才用几天就不香了)，若使用`Node.js 21+`下文的`entry-server.js`可以尝试修改一下实现不打包而直接运行了并且可以使用 node 自带的 `watch` 命令，前提是不使用 SFC 。

- `Node.js >= 18.0.0`(支持`fetch API`)
- `Vue >= 3.2`
- `VueRouter >= 4.0`
- `Pinia >= 2.0`
  <a name="qhqMG"></a>

## 目标清单

- ✅ [组件渲染](https://github.com/Jon-a-than/vue3-ssr-mini/tree/v0.0.1)
- ✅ [路由功能](https://github.com/Jon-a-than/vue3-ssr-mini/tree/v0.0.2)
- ✅ [状态管理](https://github.com/Jon-a-than/vue3-ssr-mini/tree/v0.0.3)
- ✅ 数据预取
- 🚧 部分预渲染
  <a name="g0xKM"></a>

## 依赖

`Vue3`服务端渲染最重要的依赖是`vue`与`@vue/server-renderer`,`@vue/server-renderer`用于将组件在服务端渲染为`html`字符串，从而拼接到`html`中，不过`@vue/server-renderer`已经在`vue`包中内置了所以不必单独安装 :p。

```bash
pnpm i vue -P
```

<a name="dVRRD"></a>

## Node.js渲染Vue组件

<a name="gOCmA"></a>

### 组件渲染

既然要最简实现，所以使用`h`函数来创建`Vue`组件而并不是单文件组件。<br />先创建`entry-server.js`(该文件名已成约定)来看看`renderToString`这个函数的功能。

```javascript
import { h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const app = h('h1', 'Hello world!')

const AppString = await renderToString(app)

console.log(AppString) // <h1>Hello World!</h1>
```

`package.json`编写一下运行脚本, 执行`pnpm dev:server`即可看到`<h1>Hello World!</h1>`的结果。这么神奇! 那我们把字符串插入到`HTML`模板中岂不就完成了服务端渲染，页面静态生成好像也是一步之遥。

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

:::success
由于使用的是`ESM`，要记得在`package.json`中添加`"type": "module"`
:::

<a name="vhAj2"></a>

### 拼接HTML页面

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

```javascript
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

`pnpm dev:server`运行后得到输出,。

```html
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

<a name="WHDHK"></a>

## 构建服务端

在`entry-server.js`中启动一个`node`服务器，用于响应请求。<br />服务端开启后返回拼接后的`html`页面, 直接`curl localhost:4936`后返回了拼接后的`html`页面，至此就实现了服务端渲染功能。这里的`render`函数中读取`index.html`的步骤可以将其改为全局常量，这样就不需要每次请求都进行文件的读取，可以优化首屏渲染时间和服务器资源消耗。

```javascript
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

async function render(root) {/* ... */}
```

此时浏览器访问`localhost:4936`即可看到`Hello World!`
<a name="MwzDL"></a>

## 客户端激活

<a name="jN0nS"></a>

### 计数器组件

现在我们的页面有`html`元素，没有`css`或`js`。我们先创建一个包含状态和事件的计数器组件。

```javascript
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
      h('button', { onClick: handleAdd }, 'Add'),
    ])
})

export default Counter

```

```javascript
// import ...
import Counter from './App.js'

const component = h(Counter)

startServer()
/** @desc 启动服务器 */
function startServer() {/* ... */}

/** @desc 渲染并拼接HTML */
async function render(root) {/* ... */}
```

现在将`entry-server.js`中渲染的组件改为计数器组件后再次重启服务端（注意这里由于目前是直接给`Node.js`运行的`esm`模块，所以在导入模块时需要添加文件后缀），打开浏览器打开`localhost:4936`可以看到页面已经正常渲染了，但点击按钮却没有任何效果。
<a name="XS1hG"></a>

### Hydration

现在我们需要给客户端的静态页面绑定事件，和响应式数据，这一步官方称为注水或客户端激活(`hydration`)。当然我们可以直接在客户端使用`createApp`重新渲染一个`CSR`应用，不过`Vue`提供了`createSSRApp`方法专门用于客户端激活，同`createApp`一样会返回一个包含`mount`方法的对象，用于在客户端挂载到应用的根元素上。我们将默认导出改为使用`createSSRApp`创建应用实例而不是直接导出组件。

```javascript
import { createSSRApp, defineComponent, h, ref } from 'vue'

const Counter = defineComponent(() => {/* ... */})

export default () => createSSRApp(Counter)

```

创建需要在浏览器中运行的激活函数。

```javascript
import createApp from './App'

startHydration()

/** @desc 基于服务端渲染的静态页集成Vue事件绑定，响应式状态等 */
function startHydration() {
  const app = createApp()

  app.mount('#app')

  console.log('hydration success')
}

```

我们还需要打包一下`entry-client.js`将`vue`打包入该文件，当然使用`CDN`的方式导入也可以。这里使用`esbuild`打包。

```bash
pnpm i esbuild -D
```

```javascript
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
      __VUE_OPTIONS_API__: 'false',
    },
  })
}

```

添加一下`package.json`的脚本,执行一下`pnpm build:client`即可看到已经将`entry-client.js`打包在`dist`目录下了。

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

<a name="CsPbf"></a>

## 静态资源服务

<a name="ISqeV"></a>

### 引入客户端入口文件

现在在我们的`index.html`中引入客户端激活脚本`dist/entry-client.js`，记得要在`script`标签上添加`type="module"`或`defer`属性，或者将其移到`div#app`元素下方 (确保`app.mount('#app')`脚本运行时元素已经存在)。

顺带一笔，刚开始打算直接把`dist/entry-client.js`中的内容拼接到`html`的`script`标签内，但这加大了网页爬虫的加载时间，若拼接在`html`内，则使用`curl`访问时会将`javascript`文件也拉下来，而通过`script`的`src`方式导入则只仅会显示一个标签，爬虫可以更快的获取到页面。

但相应的客户端就要再次发起请求获取`js`了，在请求`js`期间不能处理页面的用户事件(在慢速`3G`的网络下慢了2s左右，但对于爬虫完成`html`请求快了3.7s左右)。<br />![使用script src属性加载](https://cdn.nlark.com/yuque/0/2023/png/22950541/1698245454593-02c68d34-c77a-4d7d-bf8c-ed9f855ecefb.png#averageHue=%23f5f4f3&clientId=uf901401a-2be9-4&from=paste&height=260&id=ua72f78ce&originHeight=325&originWidth=1198&originalType=binary&ratio=1.25&rotation=0&showTitle=true&size=47243&status=done&style=none&taskId=u260ee234-d8bb-424c-a63a-22b8d494946&title=%E4%BD%BF%E7%94%A8script%20src%E5%B1%9E%E6%80%A7%E5%8A%A0%E8%BD%BD&width=958.4 "使用script src属性加载")<br />![使用内联的script标签](https://cdn.nlark.com/yuque/0/2023/png/22950541/1698245459157-4129c85e-d995-4d98-b811-24a9553f302a.png#averageHue=%23f5f4f3&clientId=uf901401a-2be9-4&from=paste&height=235&id=u06fe5d71&originHeight=294&originWidth=1200&originalType=binary&ratio=1.25&rotation=0&showTitle=true&size=42753&status=done&style=none&taskId=u68ee15dc-ab5e-4c06-8760-ce926012ebe&title=%E4%BD%BF%E7%94%A8%E5%86%85%E8%81%94%E7%9A%84script%E6%A0%87%E7%AD%BE&width=960 "使用内联的script标签")

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini SSR</title>
    <script type="module" src="dist/entry-client.js" ></script>
  </head>
  <body>
    <div id="app"><!-- App Slot --></div>
  </body>
</html>

```

浏览器会请求静态资源，此时就需要在服务端处理静态资源请求服务，若请求路径存在后缀则判定为请求静态资源，否则返回服务端渲染界面。至此就完成了基本的服务端渲染了，浏览器打开`localhost:4936`计数器正常渲染，并且`vue`也与客户端`DOM`绑定了响应式数据。

使用`createSSRApp`函数创建的实例不应该被重复使用，而应在每次响应时都创建一个新的实例，否则在第二次请求时服务端控制台会发出如下警告：<br />`[Vue warn]: App already provides property with key "Symbol(v-scx)". It will be overwritten with the new value.`<br />若还使用了路由与状态管理插件则可能会影响不同请求的渲染结果（官方文档：[跨请求状态污染](https://cn.vuejs.org/guide/scaling-up/ssr.html#cross-request-state-pollution)）。

```javascript
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
async function render(root) {/* ... */}

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
      svg: 'image/svg+xml',
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

<a name="wXux4"></a>

### CSS与图片资源

原先打算为了轻量而不使用`vite`的，但`esbuild`的`css`打包`spliting`选项功能太少了，而且会在每个引入有`css`的组件的文件处都生成一份样式文件使打包结果比较混乱，在打包后生成的`metafile`中也难以精确的知道是哪个组件需要样式文件只能全局引入。

而`rollup`或`rspack`暂时不能开箱即用需要一些插件支持，所以还是决定使用`vite`来进行打包，所以，现在`css`与图片资源与使用`vite`的应用一样了都由`vite`来托管了😅(包括动态的导入所需的静态资源也已经自动注入了`profill`与`vitePreload`函数来处理，这就是开箱即用的魅力吧)。`vite`服务端热更新在官网文档有介绍，这里先只关注于服务端渲染的实现，所以没有处理开发环境，只处理生产环境，需要打包后再预览。

```bash
pnpm i vite -D
pnpm rm esbuild -D
```

下面是`vite`客户端打包配置，为了方便仓库打包产物，这里把`target`设为`es2022`并关闭产物压缩。

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    target: ['es2022'],
    minify: false,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
      generateScopedName: '[name]_[local]_[hash:5]',
    },
  },
})

```

将`html`引入的文件改为`src/entry-client`由`vite`控制打包后的资源请求目录。

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <!-- ... -->
    <script type="module" src="src/entry-client.js" ></script>    
    <!-- Head Slot -->
  </head>
  <body>
    <div id="app"><!-- App Slot --></div>
  </body>
</html>

```

由于`node.js`引入`esm`需要添加额外的`.js`后缀很麻烦，所以对`entry-server.js`也进行打包处理。新建一个单独的`vite`配置文件用于打包服务端入口文件，将打包产物放到`dist/server`目录下，如此`entry-server.js`与 HTML 目标的相对位置与源码目录一致。

```javascript
import clientConfig from './vite.config'
import { defineConfig, mergeConfig } from 'vite'

export default mergeConfig(
  clientConfig,
  defineConfig({
    build: {
      outDir: 'dist/server',
      ssr: 'src/entry-server.js',
      ssrManifest: true,
    },
  })
)

```

配置一下`package.json`脚本, **注意要先打包**`**client**`**,再打包**`**server**`**否则**`**vite**`**会在生成客户端打包产物时把 dist 中的打包**`**server**`**目录清空**

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
    "vue": "^3.3.7",
  },
  "devDependencies": {
    "@types/node": "^20.8.9",
    "vite": "^4.5.0"
  }
}

```

重构一下`entry-server.js`的代码可以把`.js`后缀去除了。

```javascript
// import ...

// 可以把 `.js` 后缀去除了
import createApp from './App'

// ...
```

<a name="bQDS8"></a>

### 资源preload

该部分与打包工具关联性较强，`vite`默认在客户端打包产物中自动添加`preload`相关的`js`代码。<br />🚧WIP

<a name="gSUBL"></a>

## 优化

<a name="ofSz5"></a>

### 基于SSR预渲染

对于长时间的不会更新的路由可以在构建阶段直接生成 HTML 后保存为静态资源，服务端判定路由为预渲染路由则直接返回对应的静态资源，亦可使用 Nginx 配置路径的转发。<br />新建`entry-prerender.js`用于在构建阶段对特定路由预渲染。

```javascript
import { readFile } from 'node:fs/promises'
import { fileURLToPath, resolve } from 'node:path' 

import { render } from './entry-server.js'

const distPath = fileURLToPath(new URL('..', import.meta.url))

/**
	* @params {string[]} 需要预渲染的路由
	*/
async function startPrerender(routes) {
  routes = [...new Set(...routes.map(cleanRouteMap)]
  
  routes.map(async (route) => {
    const path = routeToFilePath(route)
    const page = await render(route)

    writeFile(path, page)
  })
}

function cleanRouteMap(route) {
  route = route[0] === '/' ? route : '/' + route)
  return route.at(-1) === '/' ? route.slice(0, -1) : route)
}

```

使用基于 `vite` 的 build API 进行静态资源的压缩处理与 sitemap 的生成。
<a name="r5YYB"></a>

### 缓存服务端渲染结果

对服务端的渲染结果进行
<a name="McfcZ"></a>

### Island


<a name="SjbSf"></a>

## 参考

[服务端渲染 (SSR) | Vue.js](https://cn.vuejs.org/guide/scaling-up/ssr.html#server-side-rendering-ssr)<br />[Vue.js 服务器端渲染指南 | Vue SSR 指南](https://v2.ssr.vuejs.org/zh/)<br />[Pinia 🍍](https://pinia.vuejs.org/zh/ssr/)<br />[Vite](https://vitejs.dev/guide/ssr)