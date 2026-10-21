import {fireEvent, render, screen} from '@testing-library/react'
import {expect, test, vi} from 'vitest'
import LoginPage from './LoginPage'

//Fake supabase so tests dont hit production database
vi.mock('../lib/supabase', ()=> ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn().mockResolvedValue({error: {message: 'bad login'}})
        },
    },
}))

test('shows an error when login fails', async () => {
    render (<LoginPage/>)

    fireEvent.change(screen.getByPlaceholderText('email'), {target: {value: 'testacc@test.com'}})
    fireEvent.change(screen.getByPlaceholderText('password'), {target : {value: 'wrongPassword'}})
    fireEvent.click(screen.getByText('Log In'))
    
    
    expect(await screen.findByText('Invalid email or password')).toBeTruthy()
})