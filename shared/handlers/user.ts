import { http, HttpResponse, HttpHandler } from 'msw'
import { getUserByUsername, addUser, type User } from '../entity/user'

export const userHandlers: HttpHandler[] = [
  http.post<never, User>(`${location.origin}/api/user/register`, async ({ request }) => {
    const user = await request.json()

    const hasRegistered = await getUserByUsername(user.username)
    if (hasRegistered) {
      return HttpResponse.json({ msg: 'user has registered' }, { status: 400 })
    }

    await addUser({ ...user, password: globalThis.btoa(user.password) })

    return HttpResponse.json({ token: generateToken({ username: user.username }) }, { status: 200 })
  }),
  http.post<never, User>(`${location.origin}/api/user/login`, async ({ request }) => {
    const user = await request.json()
    const hasRegistered = await getUserByUsername(user.username)

    if (!hasRegistered) {
      return HttpResponse.json({ msg: 'user not found' }, { status: 400 })
    } else if (hasRegistered.password !== globalThis.btoa(user.password)) {
      return HttpResponse.json({ msg: 'password error' }, { status: 400 })
    }

    return HttpResponse.json({
      token: generateToken({ username: user.username })
    })
  })
]

function generateToken(
  payload: Omit<User, 'password'>,
  exp: number = Date.now() + 1000 * 60 * 60 * 24
) {
  return globalThis.btoa(JSON.stringify({ ...payload, exp }))
}

export function verifyToken(token: string) {
  const payload = JSON.parse(globalThis.atob(token))
  if (payload.exp > Date.now()) {
    return payload
  } else {
    return false
  }
}
