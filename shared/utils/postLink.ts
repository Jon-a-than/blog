export function getCurrentPostLink(pathname: string): string {
  if (pathname.startsWith(import.meta.env.BASE_URL)) {
    pathname = pathname.slice(import.meta.env.BASE_URL.length - 1)
  }

  /** 首页 */
  if(pathname.startsWith(import.meta.env.VITE_SPECIAL_PREFIX_URL)) {
    pathname = pathname.slice(import.meta.env.VITE_SPECIAL_PREFIX_URL.length)
  }

  const path = pathname.split('/')
  if (path.at(-1) === '') {
    if (path.length <= 2) {
      return '/index'
    } else if (path.at(-2)?.endsWith('.html')) {
      return path.slice(0, -1).join('/').slice(0, -5)
    } else {
      return path.join('/') + 'index'
    }
  }
  const postLink = path.join('/')
  return postLink.endsWith('.html') ? postLink.slice(0, -5) : postLink
}
