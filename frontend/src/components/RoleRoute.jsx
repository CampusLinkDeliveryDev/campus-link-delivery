import {Navigate} from 'react-router-dom'

//only lets active users with right roles see a page
export default function RoleRoute({auth, role, children}){
    const {session, profile, error} = auth

    if (!session) return <Navigate to="/login" replace/>
    if (error) return <Navigate to="/" replace/>
    if (!profile) return <p>Loading...</p>


    if (profile.role !== role || profile.status !== 'active') return <Navigate to="/" replace/>

    return children
}