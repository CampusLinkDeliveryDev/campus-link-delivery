import {useEffect, useState} from 'react'
import {apiFetch} from '../lib/api'

//Get /api/me sends snake_case fields, enum values in caps
export function toProfile(data){
    return{
        fullName: data.full_name || data.email,
        email: data.email,
        phone: data.phone,
        role: data.role.toLowerCase(),
        status: data.account_status.toLowerCase(),
        isAvailable: data.is_available
    }
}


//Loads logged in users profile from the backend whenever the user changes 
export function useProfile(session){
    const userId = session?.user?.id
    const [result, setResult] = useState({userId: null, profile: null, error: null})

    useEffect(() => {
        if (!userId) return

        let active = true

        apiFetch('/api/me').then((data) => active && setResult({userId, profile: toProfile(data), error: null}))
            .catch((error) => active && setResult({userId, profile: null, error}))
        
        //ignroe if the user logs out before it arrives
        return () => {
            active = false
        }
    }, [userId])

    // only use result that belongs to the user currently logged in
    if (!userId || result.userId !== userId) return {profile: null, error: null}
    return {profile: result.profile, error: result.error}
}