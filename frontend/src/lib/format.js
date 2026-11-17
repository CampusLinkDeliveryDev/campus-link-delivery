// prices come from the backend as numbers
export function formatPrice(price){
    return new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'}).format(Number(price))
}

//comverts '08:30:00' to '08:30'
export function formatTime(time){
    return time.slice(0, 5)
}

// "08:30:00" to minutes since midnight
export function toMinutes(time){
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

// returns boolean for vendors set hours
export function isOpenNow(opensAt, closesAt, now = new Date()){
    if (!opensAt || !closesAt) return null

    const current = now.getHours() * 60 + now.getMinutes()
    return current >= toMinutes(opensAt) && current < toMinutes(closesAt)
}
