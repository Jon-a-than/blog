import { useIcon } from '../useIcon'
import { IconDataURL } from './iconDataUrl'
import styleSheet from './index.css?raw'

import { title as siteTitle, menu } from '@/config/app.config.json'

const enum Theme {
  Key = 'color-mode',
  Dark = 'dark',
  Light = 'light'
}

export class HeaderBar extends HTMLElement {
  private shadow = this.attachShadow({ mode: 'open' })

  constructor() {
    super()
  }
  connectedCallback() {
    this.loadStyleSheet()

    const title = this.createTitle()
    const navList = this.createNavList()

    const headerWrapper = document.createElement('header')
    headerWrapper.classList.add('header_container')
    headerWrapper.append(title, navList)

    this.shadow.appendChild(headerWrapper)
  }

  loadStyleSheet() {
    const sheet = new CSSStyleSheet()
    sheet.replace(styleSheet)
    sheet.insertRule(useIcon('.switch-handle-icon', IconDataURL['i-uil-sun']))
    sheet.insertRule(useIcon('[data-state="on"] .switch-handle-icon', IconDataURL['i-uil-moonset']))
    menu.forEach(({ icon }, index) => {
      sheet.insertRule(useIcon(`.icon-${index}`, icon))
    })
    this.shadow.adoptedStyleSheets.push(sheet)
  }

  createTitle() {
    const title = document.createElement('h3')
    title.innerHTML = `<a class="title_link" href="/">${siteTitle}</a>`
    title.classList.add('title')

    return title
  }

  createNavList() {
    const nav = document.createElement('nav')
    const list = document.createElement('ul')
    list.classList.add('list')
    list.append(...this.buildMenu(), this.createListItem(this.createDarkModeSwitch()))

    nav.appendChild(list)
    return nav
  }

  createListItem(...nodes: (string | Node)[]) {
    const listItem = document.createElement('li')
    listItem.classList.add('list_item')
    listItem.append(...nodes)

    return listItem
  }

  buildMenu() {
    return menu.map(({ title, link }, index) => {
      const navLink = document.createElement('a')
      navLink.href = link
      navLink.classList.add('nav_link')
      const i = document.createElement('i')
      i.classList.add(`icon-${index}`)
      navLink.append(i, title)

      return this.createListItem(navLink)
    })
  }

  createDarkModeSwitch() {
    const button = document.createElement('button')
    button.classList.add('switch', 'inline-center')
    button.innerHTML = `<span class="switch-handle inline-center"><i class="switch-handle-icon"></i></span>`

    button.title = '深色模式'
    const colorMode = localStorage.getItem(Theme.Key)
    if (colorMode === Theme.Dark) document.documentElement.classList.add(Theme.Dark)
    button.dataset.state = colorMode === Theme.Dark ? 'on' : 'off'

    button.addEventListener('click', () => {
      document.documentElement.classList.toggle(Theme.Dark)
      const isDark = document.documentElement.classList.contains(Theme.Dark)
      localStorage.setItem(Theme.Key, isDark ? Theme.Dark : Theme.Light)
      button.dataset.state = isDark ? 'on' : 'off'
    })

    return button
  }
}
