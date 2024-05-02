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

export const weathers = ['sunny', 'cloudy'] as const
export const weatherIcons = {
  sunny: 'i-uil-bright',
  cloudy: 'i-uil-clouds'
} as const satisfies Record<typeof weathers[number], string>

interface PostCategory {
  tag: string
  name: string
  icon: string
  description: string
}

export const postCategoryMap = [
  {
    tag: 'mini-ssr',
    name: '极简 SSR',
    icon: 'i-uil-blogger-alt',
    description: '学习和记录基于 Vue3 技术栈实现简单的服务端渲染 (SSR) 功能'
  },
  {
    tag: 'markdown',
    name: 'Vite',
    icon: 'i-file-icons-markdownlint',
    description:
      'Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.'
  },
  {
    tag: 'net',
    name: 'Vite',
    icon: 'i-uil-server-network',
    description:
      'Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.'
  }
] as const satisfies PostCategory[]
