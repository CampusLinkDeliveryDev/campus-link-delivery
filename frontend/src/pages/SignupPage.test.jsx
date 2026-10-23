import {cleanup, fireEvent, render, screen } from '@testing-library/react'
import {afterEach, expect, test, vi} from 'vitest'
import {supabase} from '../lib/supabase'
import SignupPage from './SignupPage'


vi.mock('../lib/supabase',() => ({
    supabase: {
        auth: {
            signUp: vi.fn().mockResolvedValue({data: {session: null}, error: null}),
        },
    },
}))

// Remove the previous tests form from the screen
afterEach(cleanup)

function fillForm(email){
    fireEvent.change(screen.getByPlaceholderText('Fullname'), {target: { value: 'Abdallah'}})
    fireEvent.change(screen.getByPlaceholderText('email (@rdpolytech.ca)'), {target: {value: email}})
    fireEvent.change(screen.getByPlaceholderText('password'), {target: {value: "pass123"}})
    fireEvent.click(screen.getByText('Sign up'))
}


test('rejects emails that are not @rdpolytech.ca', async () => {
    render(<SignupPage/>)

    fillForm('testuser@gmail.com')
    expect(await screen.findByText('Use your @rdpolytech.ca email')).toBeTruthy()
    expect(supabase.auth.signUp).not.toHaveBeenCalled()
})


test('sends the signup details and asks the user to confirm their email', async () => {
    render(<SignupPage/>)

    fillForm('student@rdpolytech.ca')
    expect(await screen.findByText('Check your email to confirm your account')).toBeTruthy()
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'student@rdpolytech.ca',
        password: 'pass123',
        options: {data: {full_name:'Abdallah', phone: '', role: 'customer' }},
    })
})