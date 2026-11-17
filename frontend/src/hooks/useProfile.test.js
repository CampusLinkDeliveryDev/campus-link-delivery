import {expect, test, vi } from 'vitest'
import {toProfile} from './useProfile'


// the hook file imports the api client, the real one nad the supabase stays ouit of this
vi.mock('../lib/api', () => ({apiFetch: vi.fn()}))

test('turns the /api/me response into a profile with lowercase role and status', () => {
    const profile = toProfile({
        full_name: 'Test Aaybee',
        email: 'testuser@rdpolytech.ca',
        phone: null,
        role: 'COURIER',
        account_status: 'PENDING_APPROVAL',
        is_available: false

    })

    expect(profile).toEqual({
        fullName: 'Test Aaybee',
        email: 'testuser@rdpolytech.ca',
        phone: null,
        role: 'courier',
        status: 'pending_approval',
        isAvailable: false
    })
})

test('uses email as the name when full_name is empty', () => {
    const profile = toProfile({
        full_name: '',
        email: 'testuser@rdpolytech.ca',
        phone: null,
        role: 'CUSTOMER',
        account_status: 'active',
        is_available: false
    })

    expect(profile.fullName).toBe('testuser@rdpolytech.ca')
    expect(profile.role).toBe('customer')
    expect(profile.status).toBe('active')
})