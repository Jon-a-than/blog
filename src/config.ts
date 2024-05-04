export const appConfig = {
  postCategories: [
    {
      link: '/blogs',
      name: 'blog'
    },
    {
      link: '/notes',
      name: 'note'
    },
    {
      link: '/posts',
      name: 'post'
    }
  ]
} as const satisfies {
  postCategories: {
    link: string
    name: string
  }[]
}

export const weathers = ['sunny', 'cloudy', 'moonRain'] as const
export const weatherIcons = {
  sunny: 'i-uil-bright',
  cloudy: 'i-uil-clouds',
  moonRain: 'i-uil-cloud-moon-rain'
} as const satisfies Record<(typeof weathers)[number], string>

interface PostCategory {
  tag: string
  name: string
  icon: string
  description: string
}

export const postCategoryMap = [
  {
    tag: 'astro-blog',
    name: 'Astro 博客',
    icon: 'i-logos-astro-icon?mask',
    description: '使用 Astro 构建一个静态博客'
  },
  {
    tag: 'mini-ssr',
    name: '极简 SSR',
    icon: 'i-uil-blogger-alt',
    description: '学习和记录基于 Vue3 技术栈实现简单的服务端渲染 (SSR) 功能'
  },
  {
    tag: 'eslint-plugin-biome',
    name: 'ESLint Plugin Biome',
    icon: 'i-file-icons-eslint',
    description: '实现一个自定义的 ESLint 插件, 类似 eslint-plugin-prettier'
  },
  {
    tag: 'yulania-progress',
    name: '加载进度条',
    icon: 'i-file-icons-npm',
    description: '实现一个简单的前端进度条 @yulania/progress, 用于在页面跳转/加载时显示进度条'
  },
  {
    tag: 'gin-scheme',
    name: 'Gin 单体项目最佳实践探索',
    icon: 'i-logos-gin  grayscale',
    description: '探索 Golang 服务端库 Gin 在单体项目中的最佳实践, 包括项目结构、中间件、错误处理等'
  },
  {
    tag: 'nestjs-scheme',
    name: 'Nestjs 单体项目最佳实践探索',
    icon: 'i-file-icons-nestjs',
    description:
      '探索 TypeScript 服务端框架 Nestjs 在单体项目中的最佳实践, 包括项目结构、中间件、错误处理等'
  },
  {
    tag: 'Vue-scheme',
    name: 'Vue3 最佳实践探索',
    icon: 'i-uil-vuejs-alt',
    description:
      '探索 TypeScript 服务端框架 Nestjs 在单体项目中的最佳实践, 包括项目结构、中间件、错误处理等'
  }
] as const satisfies PostCategory[]
