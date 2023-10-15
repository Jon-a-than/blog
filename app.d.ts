declare module '@nuxt/schema' {
  interface NavLink {
    title: string
    link: string
    icon?: string
    items?: NavLink[]
  }

  interface AppConfigInput {
    navbar: {
      /** @desc 导航栏标题 */
      subtitle: string
      /** @desc 导航栏链接 */
      navLinks: NavLink[]
    }
  }
}

export { }
