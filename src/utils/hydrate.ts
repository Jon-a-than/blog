export function hydrate(fn: () => void) {
  fn()
  document.addEventListener('astro:after-swap', fn)
}
