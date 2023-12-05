import './comment'
import '@/shared/index'

parseMenu()

function parseMenu() {
  const anchorList = document.querySelectorAll('.anchor') as NodeListOf<HTMLAnchorElement>

  const menu: string[] = []
  // @ts-expect-error todo 目录信息采集
  anchorList.forEach(({ href, name }) => menu.push({ href, name }))

  console.log(menu)
}
