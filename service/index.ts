self.onmessage = function (event) {
  console.log('event', event)
}

self.addEventListener('install', () => {
  console.log('install')
  self.skipWaiting()
})
self.addEventListener('activate', () => {
  console.log('activate')
})

self.addEventListener('message', (e) => {
  console.log('e', e)
})
