export interface BlogConfig {
  blog: {
    site: string
    author: string
    navbarLinks: {
      target?: '_blank' | '_self'
      name?: string
      title: string
      icon: string
      link: string
    }[]
  }

  markdown: {
    weathers: Record<string, string>
  }

  pages: {
    index: {
      location: string
      npmPackages: {
        name: string
        description: string
      }[]
    }
    post: {
      navigation: {
        link: string
        name: string
      }[]
      categories: PostCategory[]
    }
    friendLink: {
      links: FriendLink[]
    }
  }

  rss: RSS
}

interface FriendLink {
  name: string
  avatar: string
  description: string
  url: string
}

interface PostCategory {
  tag: string
  name: string
  icon: string
  description: string
}

interface RSS {
  title: string
  description: string
  customData?: Partial<{
    /** @link https://www.rssboard.org/rss-language-codes */
    language: string
    copyright: string
    [key: string]: string
  }>
}
