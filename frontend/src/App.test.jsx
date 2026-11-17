import {cleanup, render, screen } from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, beforeEach, expect, vi, test} from 'vitest'
import {supabase} from './lib/supabase'
import {apiFetch} from './lib/api'
import App from './App'


//supabase mock
vi.mock('./lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({data: {session: null}}),
            onAuthStateChange: vi.fn(() => ({data: {subscription: {unsubscribe: vi.fn() }}}) ),
            signOut: vi.fn(),
        },
    },
}))

//backend (/api/me) mock
vi.mock('./lib/api', () => ({ apiFetch: vi.fn().mockResolvedValue('ok') }))

//other backend calls returns empty list
beforeEach(() => {
    apiFetch.mockResolvedValue([])
})

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

function renderAt(url){
    render(
        <MemoryRouter initialEntries={[url]}>
            <App/>
        </MemoryRouter>
    )
}

function logInAs(role, accountStatus = 'active'){
    supabase.auth.getSession.mockResolvedValueOnce({
        data: {session: {user: {id : 'user-1', email: 'student@rdpolytech.ca'}}}
    })

    apiFetch.mockResolvedValueOnce({
        full_name: 'Aay bee',
        email: 'student@rdpolytech.ca',
        phone: null,
        role, 
        account_status: accountStatus,
        is_available: false
    })
}


test('logged out users are sent to the login page', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', {name: 'Login'})).toBeTruthy()
})


test('the signup page has its own URL', async () => {
    renderAt('/signup')
    expect(await screen.findByRole('heading', {name: 'Create account'})).toBeTruthy()
})

test('the forgot password page is reachable while logged out', async () => {
    renderAt('/forgot-password')
    expect(await screen.findByRole('heading', {name: 'Forgot Password'})).toBeTruthy()
})

test('customers land on the customer dashboard after login', async () => {
    logInAs('CUSTOMER')
    renderAt('/login')
    expect(await screen.findByRole('heading', { name: 'Customer dashboard' })).toBeTruthy()
    expect(apiFetch).toHaveBeenCalledWith('/api/me')
})

test('couriers land on the courier dashboard', async () => {
    logInAs('COURIER')
    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'Courier dashboard' })).toBeTruthy()
})

test('pending couriers see the approval screen', async () => {
    logInAs('COURIER', 'pending_approval')
    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'Waiting for approval' })).toBeTruthy()
})

test('customers cannot open the admin dashboard', async () => {
    logInAs('CUSTOMER')
    renderAt('/admin')
    expect(await screen.findByRole('heading', { name: 'Customer dashboard' })).toBeTruthy()
})

test('suspended users are told their account is suspended', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: 'user-1', email: 'student@rdpolytech.ca' } } },
    })
    apiFetch.mockRejectedValueOnce(Object.assign(new Error('Request failed (403)'), { status: 403 }))

    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'Account suspended' })).toBeTruthy()
})