import { getCurrentPostLink } from '../utils/postLink'
import { HttpResponse, http, type HttpHandler } from 'msw'
import { addComment, getComments, type BaseFields, type Comment } from '../entity/comment'

interface CityInfo {
  name: string
  country: string
  adm1: string
  adm2: string
}

const sortByDate = <T extends { date: number }>(a: T, b: T) => b.date - a.date

export const commentHandlers: HttpHandler[] = [
  http.get(`${location.origin}/api/comment`, async ({ request }) => {
    const comments = await getComments()
    const searchParams = new URL(request.url).searchParams
    const limit = +(searchParams.get('limit') || 10)

    if (searchParams.has('home')) {
      return HttpResponse.json(comments.sort(sortByDate).slice(0, limit))
    } else {
      const postLink = getCurrentPostLink(location.pathname)

      return HttpResponse.json(
        comments.filter((comment) => postLink === comment.postLink).sort(sortByDate)
      )
    }
  }),
  http.post(`${location.origin}/api/comment`, async ({ request }) => {
    const body = (await request.json()) as Omit<Comment, keyof BaseFields>
    const { country, adm1 } = await getCityInfo()

    const newComment = await addComment({
      ...body,
      position: `${country} • ${adm1}`
    })

    return HttpResponse.json(newComment, { status: 201 })
  })
]

async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

async function getCityInfo(): Promise<CityInfo> {
  const { coords } = await getCurrentPosition()

  const res = await fetch(
    `https://geoapi.qweather.com/v2/city/lookup?location=${coords.longitude},${
      coords.latitude
    }&key=${import.meta.env.VITE_API_GEO_KEY}`
  )

  const { location } = await res.json()

  return location[0] ?? { name: 'unknown', country: 'unknown', adm1: 'unknown', adm2: 'unknown' }
}
