const formatter = new Intl.RelativeTimeFormat('zh', { numeric: 'auto' })
const units: [weight: number, max: number, unit: Intl.RelativeTimeFormatUnit][] = [
  [1, 60, 'minutes'],
  [60, 24, 'hours'],
  [24 * 60, 7, 'days'],
  [24 * 60 * 7, 4, 'weeks'],
  [24 * 60 * 30, 12, 'months'],
  [24 * 60 * 30 * 12, Number.POSITIVE_INFINITY, 'years']
]

export function getRelativeDate(date: Date, current: Date = new Date()): string {
  const timeDiff = Math.round((date.getTime() - current.getTime()) / 60_000)
  return formatter.format(...getNearest(timeDiff))
}

// @ts-expect-error must return a value
function getNearest(timeDiff: number): [number, Intl.RelativeTimeFormatUnit] {
  for (const [weight, max, unit] of units) {
    const value = Math.round(timeDiff / weight)

    if (Math.abs(value) < max) {
      return [value, unit]
    }
  }
}
