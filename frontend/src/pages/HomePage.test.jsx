import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { apiFetch } from '../lib/api'
import HomePage from './HomePage'

vi.mock('../lib/supabase', () => ({ supabase: { auth: { signOut: vi.fn() } } }))
vi.mock('../lib/api', () => ({ apiFetch: vi.fn() }))

afterEach(cleanup)

const session = { user: { email: 'student@rdpolytech.ca' } }

test('shows that the backend accepted the token', async () => {
  apiFetch.mockResolvedValueOnce('Authentication successful')
  render(<HomePage session={session} />)

  expect(await screen.findByText('Backend: Connected')).toBeTruthy()
  expect(apiFetch).toHaveBeenCalledWith('/api/security/test')
})

test('shows why the backend could not be reached', async () => {
  apiFetch.mockRejectedValueOnce(new Error('Request failed (500)'))
  render(<HomePage session={session} />)

  expect(await screen.findByText('Backend: Not Connected: Request failed (500)')).toBeTruthy()
})