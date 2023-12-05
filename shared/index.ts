import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
import './global.css'

import { HeaderBar } from './components/HeaderBar/index'
import { BaseTag } from './components/BaseTag/index'

import { setupWorker } from 'msw/browser'
import { commentHandlers } from './handlers/comment'

setupWorker(...commentHandlers).start({
  onUnhandledRequest: 'bypass'
})
customElements.define('base-tag', BaseTag)
customElements.define('header-bar', HeaderBar)
