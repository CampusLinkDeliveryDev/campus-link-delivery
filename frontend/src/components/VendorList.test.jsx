import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, expect, test, vi} from 'vitest'
import {apiFetch} from '../lib/api'
import VendorList from './VendorList'


vi.mock('../lib/api', () => ({apiFetch: vi.fn()}))

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

const vendors = [
    {id: 1, name: 'Tims', description: 'Croissants,coffees and cookies', locationName: 'Main Building', opensAt: null, closesAt: null},
    {id: 2, name: 'Subway', description: 'Sandwiches & Pizzas', locationName: 'Library', opensAt: null, closesAt: null}
]

function renderList(){
    render(<VendorList/>, {wrapper: MemoryRouter})
}

test('lists vendors from the backend with links to their menus', async () => {
    apiFetch.mockResolvedValueOnce(vendors)
    renderList()

    const link = await screen.findByRole('link', {name: 'Tims'})
    expect(link.getAttribute('href')).toBe('/customer/vendors/1')
    expect(screen.getByText('Subway')).toBeTruthy()
    expect(apiFetch).toHaveBeenCalledWith('/api/vendors')
})

test('filters vendors by the search box', async () => {
    apiFetch.mockResolvedValueOnce(vendors)

    renderList()

    fireEvent.change(await screen.findByPlaceholderText('Search vendors'), {target: {value: 'sandwiches'}})

    expect(screen.getByText('Subway')).toBeTruthy()
    expect(screen.queryByText('Tims')).toBeNull()
})


test('says when nothing matches the search', async () => {
    apiFetch.mockResolvedValueOnce(vendors)
    renderList()

    fireEvent.change(await screen.findByPlaceholderText('Search vendors'), {target: {value: 'burgers'}})

    expect(screen.getByText('No vendors found')).toBeTruthy()
})

test('shows an error when vendors cannot be loaded', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Request failed (500)'))
    renderList()

    expect(await screen.findByText("Couldn't load vendors: Request failed (500)")).toBeTruthy()
})