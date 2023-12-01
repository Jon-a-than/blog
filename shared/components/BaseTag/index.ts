import styleSheet from './index.css?raw'

export class BaseTag extends HTMLElement {
  private shadow = this.attachShadow({ mode: 'open' })

  constructor() {
    super()
  }
  connectedCallback() {
    const span = document.createElement('span')
    span.classList.add('tag')
    const text = this.getAttribute('text')
    span.textContent = text
    const color = this.getAttribute('color')
    span.classList.add(`tag-${color}`)

    this.shadow.appendChild(span)
  }

  loadStyleSheet() {
    const sheet = new CSSStyleSheet()
    sheet.replace(styleSheet)
    this.shadow.adoptedStyleSheets.push(sheet)
  }
}
