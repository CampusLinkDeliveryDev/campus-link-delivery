import {cleanup, render, screen } from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, expect, vi, test} from 'vitest'
import {supabase} from './lib/supabase'
import App from './App'


vi.mock('./lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({data: {session: null}}),
            onAuthStateChange: vi.fn(() => ({data: {subscription: {unsubscribe: vi.fn() }}}) ),
            signOut: vi.fn(),
        },
    },
}))

afterEach(cleanup)

function renderAt(url){
    render(
        <MemoryRouter initialEntries={[url]}>
            <App/>
        </MemoryRouter>
    )
}

test('logged out users are sent to the login page', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', {name: 'Login'})).toBeTruthy()
})


test('the signup page has its own URL', async () => {
    renderAt('/signup')
    expect(await screen.findByRole('heading', {name: 'Create account'})).toBeTruthy()
})

test('logged in users are redirected to home page', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
        data: {session: {user: {email: 'student@rdpolytech.ca'}}}
    })
    renderAt('/login')
    expect(await screen.findByText('Logged in as student@rdpolytech.ca')).toBeTruthy()
})