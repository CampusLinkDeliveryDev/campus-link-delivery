import {supabase} from '../lib/supabase'
import {useEffect, useState} from 'react'
import {apiFetch} from '../lib/api'

export default function HomePage({session}){

    const [backend, setBackend] = useState('Checking...')

    useEffect(()=>{
        let active = true

        //Call a protected backend route to confirm the token is accepted
        apiFetch('/api/security/test')
            .then(()=> active && setBackend('Connected'))
            .catch((error) => active && setBackend(`Not Connected: ${error.message}`))

        //Ignore the answer if the user leaves the page first
        return () => {
            active = false
        }
    }, [])

    return (
        <div>
            <p>Logged in as {session.user.email}</p>
            <p>Backend: {backend}</p>
            <button onClick={()=> supabase.auth.signOut()}>Log out</button>
        </div>
    )
}