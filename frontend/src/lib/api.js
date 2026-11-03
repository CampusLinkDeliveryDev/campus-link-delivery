import {supabase} from './supabase'

const API_URL = import.meta.env.VITE_API_URL

//Calls the spring boot backend iwth the logged in users Supabase token
export async function apiFetch(path, options = {}){
    const {data} = await supabase.auth.getSession()
    const token = data.session?.access_token

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type' : 'application/json',
            ...(token && {Authorization: `Bearer ${token}`}),
            ...options.headers
        }
    })

    //401 means the token is missing or expired, log out so the user signs in again
    if (response.status === 401) {
        await supabase.auth.signOut()
        throw new Error('Your session has expired, please log in again')
    }

    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`)
    }

    //backend may answer with json or plain text
    const type = response.headers.get('content-type')?? ''
    return type.includes('applicaiton/json') ? response.json(): response.text()
}