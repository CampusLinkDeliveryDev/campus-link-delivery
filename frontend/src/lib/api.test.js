import {afterEach, expect, test, vi} from 'vitest'
import {supabase} from './supabase'
import {apiFetch} from './api'


vi.mock('./supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({data: {session: {access_token: 'test-token'}}}),
            signOut: vi.fn(),
        }
    }
}))


//Pretend to be backend: every call returns this response
function fakeBackend(status, body, type='applicaiton/json'){
    const fetchMock = vi.fn().mockResolvedValue(
        new Response(type.includes('json') ? JSON.stringify(body) : body, {
            status,
            headers: {'content-type': type}
        })
    )
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
})


test('sends the Supabase token as a bearer header', async () => {
    const fetchMock = fakeBackend(200, {role: 'customer'})

    const result = await apiFetch('/api/me')
    expect(result).toEqual({role: 'customer'})
    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer test-token')
})

test('logs the user out when the backend says 401', async () => {
  fakeBackend(401, { error: 'expired' })

  await expect(apiFetch('/api/me')).rejects.toThrow('Your session has expired, please log in again')
  expect(supabase.auth.signOut).toHaveBeenCalled()
})

test('throws on other errors without logging out', async () => {
  fakeBackend(403, { error: 'forbidden' })

  await expect(apiFetch('/api/admin')).rejects.toThrow('Request failed (403)')
  expect(supabase.auth.signOut).not.toHaveBeenCalled()
})

test('returns plain text responses as text', async () => {
  fakeBackend(200, 'Authentication successful', 'text/plain')

  expect(await apiFetch('/api/security/test')).toBe('Authentication successful')
})  