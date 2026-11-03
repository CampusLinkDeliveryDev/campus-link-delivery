import {fireEvent, render, screen } from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {expect, test, vi} from 'vitest'
import {supabase} from '../lib/supabase'
import ForgotPasswordPage from './ForgotPasswordPage'

vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {resetPasswordForEmail: vi.fn().mockResolvedValue({error: null})}
    }
}))

test('sends a reset link that points to the reset page', async () => {
    render(<ForgotPasswordPage/>, {wrapper: MemoryRouter})

    fireEvent.change(screen.getByPlaceholderText('email'), {target: {value: 'student@rdpolytech.ca'}})
    fireEvent.click(screen.getByText('Send reset link'))

    expect(await screen.findByText('If an account exists for that email, a reset link has been sent')).toBeTruthy()
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('student@rdpolytech.ca', {
        redirectTo: `${window.location.origin}/reset-password`
    })
})