import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {afterEach, expect, test, vi} from 'vitest'
import {supabase } from '../lib/supabase'
import CourierDashboard from './CourierDashboard'
import PendingApprovalPage from './PendingApprovalPage'


vi.mock('../lib/supabase', () => ({supabase: {auth: {signOut: vi.fn()}}}))

afterEach(cleanup)

const profile = {fullName: 'Ab Syed', role: 'courier', status: 'active'}

test('the header shows whos logged in and can log out', () => {
    render(<CourierDashboard profile={profile}/>)
    screen.debug()

    expect(screen.getByText('Ab Syed (courier)', {exact:false})).toBeTruthy()
    fireEvent.click(screen.getByText('log out'))
    expect(supabase.auth.signOut).toHaveBeenCalled()
})

test('pending couriers are told to wait for approval', () => {
    render(<PendingApprovalPage profile={{ ...profile, status: 'pending_approval'}}/>)
    expect(screen.getByRole('heading', {name: 'Waiting for approval'})).toBeTruthy()
})