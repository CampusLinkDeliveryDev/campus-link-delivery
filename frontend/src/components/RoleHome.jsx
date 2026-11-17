import {Navigate} from 'react-router-dom'
import {supabase} from '../lib/supabase'
import PendingApprovalPage from '../pages/PendingApprovalPage'

const ROLES = ['customer', 'courier', 'admin']

// the '/' page works out where each user belongs and sends them there
export default function RoleHome({auth}){
    const {session, profile, error} = auth

    if (!session) return <Navigate to='/login' replace/>

    if (error || profile?.status === 'suspended'){
        const suspended = error?.status === 403 || profile?.status === 'suspended'

        return (
            <div>
                <h1>{suspended? 'Account suspended' : 'Something went wrong'}</h1>
                <p>
                    {suspended ? 
                        'Your account has been suspended. Contact admin for help':
                        `We couldn't load your profile: ${error.message}`
                    }
                </p>
                <button onClick={() => supabase.auth.signOut()}>log out</button>
            </div>
        )
    }

    if (!profile) return <p>Loading...</p>

    if (profile.status === 'pending_approval') return <PendingApprovalPage profile={profile}/>

    if (!ROLES.includes(profile.role)) return <p>Unknown account type: {profile.role}</p>

    return <Navigate to={`/${profile.role}`} replace/>
}