import {supabase} from '../lib/supabase'

export default function HomePage({session}){
    return (
        <div>
            <p>Logged in as {session.user.email}</p>
            <button onClick={() => supabase.auth.signOut()}>Log Out</button>
        </div>
    )
}