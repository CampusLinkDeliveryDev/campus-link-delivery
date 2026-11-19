import {useState} from 'react'
import {Link} from 'react-router-dom'
import {useApi} from '../hooks/useApi'
import {formatTime, isOpenNow} from '../lib/format'

export default function VendorList(){
    const {data: vendors, error, loading} = useApi('/api/vendors')
    const [search, setSearch] = useState('')

    if (loading){
        return <p>Loading vendors...</p>
    }

    if (error){
        return <p>Couldn't load vendors: {error.message}</p>
    }

    //search by name or description case insensitive
    const term = search.trim().toLowerCase()
    const shown = vendors.filter(
        (vendor) => 
            vendor.name.toLowerCase().includes(term) || 
            (vendor.description ?? '').toLowerCase().includes(term)
    )

    return (
        <section>
            <input
                type="search"
                placeholder="Search vendors"
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
            />

            {shown.length === 0 && <p>No vendors found</p>}

            <ul>
                {shown.map((vendor) => {
                    const open = isOpenNow(vendor.opensAt, vendor.closesAt)

                    return(
                        <li key={vendor.id}>
                            <Link to={`/customer/vendors/${vendor.id}`}>{vendor.name}</Link>
                            {open !== null && <span>{open ? 'Open' : 'Closed'}</span>}
                            <p>{vendor.description}</p>

                            <small>
                                {vendor.locationName}
                                {vendor.opensAt && vendor.closesAt && 
                                ` ${formatTime(vendor.opensAt)} to ${formatTime(vendor.closesAt)}`}
                            </small>
                        </li>
                    )
                })}
            </ul>
        </section>
    )

}