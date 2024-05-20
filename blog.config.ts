import type { BlogConfig } from '@/blog-config'

export const blogConfig: BlogConfig = {
  blog: {
    author: '青衫',
    site: 'https://beta.qingshaner.com',
    navbarLinks: [
      {
        name: 'blog',
        title: 'Blog & Posts',
        icon: '<lg:i-uil-blogger-alt',
        link: '/blogs'
      },
      {
        title: 'Friend Links',
        icon: 'i-uil-link-alt',
        link: '/friend-links'
      },
      {
        title: 'Legacy Blog',
        icon: 'i-uil-history',
        link: 'https://qingshaner.com'
      },
      {
        title: 'GitHub',
        icon: 'i-uil-github-alt',
        link: 'https://github.com/Jon-a-than'
      },
      {
        title: 'RSS',
        icon: 'i-uil-rss',
        target: '_blank',
        link: '/rss.xml'
      }
    ]
  },

  markdown: {
    weathers: {
      sunny: 'i-uil-bright',
      cloudy: 'i-uil-clouds',
      'cloud-sun': 'i-uil-cloud-sun',
      moonRain: 'i-uil-cloud-moon-rain',
      showers: 'i-uil-cloud-showers'
    }
  },

  pages: {
    index: {
      location: 'HangZhou, China',
      npmPackages: [
        {
          name: '@yulania/progress',
          description: '一个简单的页面切换进度条组件 (本站使用)'
        },
        {
          name: '@qingshaner/nest',
          description: '一系列用于 NestJS 的组件'
        },
        {
          name: '@qingshaner/mojito',
          description: '一个提供 propmt 的 git commit CLI 工具'
        },
        {
          name: '@depazer/cli',
          description: '一个用于查看依赖包关系的 CLI 工具'
        }
      ]
    },

    post: {
      navigation: [
        { link: '/blogs', name: 'blog' },
        { link: '/notes', name: 'note' },
        { link: '/posts', name: 'post' }
      ],
      categories: [
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
          icon: 'i-logos-gin grayscale',
          description:
            '探索 Golang 服务端库 Gin 在单体项目中的最佳实践, 包括项目结构、中间件、错误处理等'
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
      ]
    },
    friendLink: {
      links: [
        {
          name: "Guo Le's Blog",
          avatar: 'https://blog.guole.fun/img/gl.jpg',
          description: '生命是独立是自由是爱与和平',
          url: 'https://guole.fun/'
        },
        {
          name: 'itsNeko',
          avatar: 'https://dyfa.top/usr/themes/Nabo-theme-typecho-main/image/logo.jpg',
          description: '有源源就有我！',
          url: 'https://dyfa.top/'
        },
        {
          name: '小U',
          avatar: 'https://blog.starysky.top/img/blog_avatar.jpg',
          description: 'Science lights up the world',
          url: 'https://blog.starysky.top/'
        },
        {
          name: "Marvin's Blog",
          avatar: 'https://assets.marvin.nz/photo.jpeg',
          description: '时见幽人独往来，缥缈孤鸿影',
          url: 'https://marvin.nz'
        }
      ]
    }
  },
  rss: {
    title: '青衫的个人博客',
    description: '一个个人博客站点, 记录生活、技术、学习、工作等方面的内容',
    customData: {
      copyright: '青衫 2022-PRESENT CC BY-NC-SA 4.0'
    }
  }
} as const
