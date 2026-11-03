import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, expect, test, vi} from 'vitest'
import {supabase} from '../lib/supabase'
import ResetPasswordPage from './ResetPasswordPage'

vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {updateUser: vi.fn().mockResolvedValue({error: null})}
    }
}))

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

const session = {user: {email: 'student@rdpolytech.ca'}}

function fillForm(password, confirm){
    fireEvent.change(screen.getByPlaceholderText('new password'), {target: {value: password}})
    fireEvent.change(screen.getByPlaceholderText('confirm password'), {target: {value: confirm}})
    fireEvent.click(screen.getByText('Save password'))
}

test('shows an error when the passwords do not match', async () => {
    render(<ResetPasswordPage session={session}/>, {wrapper: MemoryRouter})
    fillForm('Pass1234', 'Pass4567')

    expect(await screen.findByText('Passwords do not match')).toBeTruthy()
    expect(supabase.auth.updateUser).not.toHaveBeenCalled()
})


test('saves the new password', async () => {
    render(<ResetPasswordPage session={session}/>, {wrapper: MemoryRouter})
    fillForm('secret132', 'secret132')

    expect(await screen.findByText('Password updated')).toBeTruthy()
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({password: 'secret132'})
})

test('explains when the link is invalid or expired', async () => {
    render(<ResetPasswordPage session={null}/>, {wrapper: MemoryRouter})
    expect(screen.getByText('This link is invalid or has expired')).toBeTruthy()

})