export function renderToc() {
  const AnchorList = document.querySelectorAll('.h2, .h3') as NodeListOf<HTMLAnchorElement>

  renderTocList(AnchorList)
  bindToc(AnchorList)
}

function renderTocList(AnchorList: NodeListOf<HTMLAnchorElement>) {
  const TOC_CONTAINER = document.querySelector('#tocContainer') as HTMLDivElement

  const TOC_ITEM_TEMPLATE: HTMLTemplateElement = document.querySelector('#tocItem')!
  const ANCHOR = TOC_ITEM_TEMPLATE.content.querySelector('a')!

  AnchorList.forEach((anchor) => {
    ANCHOR.textContent = decodeURI(anchor.id)
    ANCHOR.href = `#${anchor.id}`
    if (anchor.classList.contains('h3')) {
      ANCHOR.classList.add('ml-1em')
    } else {
      ANCHOR.classList.remove('ml-1em')
    }
    const template = document.importNode(TOC_ITEM_TEMPLATE.content, true)
    TOC_CONTAINER.appendChild(template)
  })
}

function bindToc(AnchorList: NodeListOf<HTMLAnchorElement>) {
  const TOC_LIST = document.querySelectorAll('#tocContainer > li') as NodeListOf<HTMLLIElement>

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries.every(({ isIntersecting }) => !isIntersecting)) return

      let flag = false
      TOC_LIST.forEach((li) => {
        const hash = (li.children[0] as HTMLAnchorElement).hash
        if (
          flag ||
          entries.every(({ target, isIntersecting }) => !isIntersecting || hash !== `#${target.id}`)
        ) {
          li.classList.remove('text-rose-3', 'before:bg-rose-3')
        } else {
          flag = true
          li.classList.add('text-rose-3', 'before:bg-rose-3')
        }
      })
    },
    {
      rootMargin: '-10px',
      threshold: 1
    }
  )

  AnchorList.forEach((anchor) => {
    intersectionObserver.observe(anchor)
  })
}
