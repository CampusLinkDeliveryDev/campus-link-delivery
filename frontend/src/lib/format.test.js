import {expect, test } from 'vitest'
import {formatPrice, formatTime, isOpenNow} from './format'

test('formats prices as canadian dollars', () => {
    expect(formatPrice(4.5)).toBe('$4.50')
    expect(formatPrice('12')).toBe('$12.00')
})

test('shortens times to hours and minutes', () => {
    expect(formatTime('08:30:00')).toBe('08:30')
})

test('works out whether a vendor is open or not', () => {
    const at = (h, m) => new Date(2026, 10, 16, h, m)

    expect(isOpenNow('08:00:00', '16:00:00', at(9, 0))).toBe(true)
    expect(isOpenNow('08:00:00', '16:00:00', at(16, 0))).toBe(false)
    expect(isOpenNow('08:00:00', '16:00:00', at(7, 59))).toBe(false)
    expect(isOpenNow(null, '16:00:00', at(9,0))).toBe(null)
})