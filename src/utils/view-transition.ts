export function applyViewTransition(
  callback: Parameters<typeof document.startViewTransition>[0],
  animateFn: (transition: ViewTransition) => void
) {
  if (document.startViewTransition === undefined) {
    callback()
    return
  }

  const transition = document.startViewTransition(callback)
  animateFn(transition)
}

export async function circleViewTransitionAnimate(
  transition: ViewTransition,
  x: number,
  y: number
) {
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  await transition.ready

  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

  document.documentElement.animate(
    { clipPath },
    {
      duration: 500,
      easing: 'ease-in',
      pseudoElement: '::view-transition-new(root)'
    }
  )
}
