import {supabase} from '../lib/supabase'


//top bar shown on every dashboard
export default function Header({profile}){
    return (
        <header>
            <strong>Campus Link Delivery</strong>
            <span>{profile.fullName} ({profile.role})</span>
            <button onClick={() => supabase.auth.signOut()}>log out</button>
        </header>
    )
}