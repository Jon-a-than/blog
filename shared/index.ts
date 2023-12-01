import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
import './global.css'

import { HeaderBar } from './components/HeaderBar/index'
import { BaseTag } from './components/BaseTag/index'

import { registerWorkers } from './service-worker'

registerWorkers().then(() => {
  console.log('worker created')
  navigator.serviceWorker.controller?.postMessage('ping')
})

customElements.define('base-tag', BaseTag)
customElements.define('header-bar', HeaderBar)
