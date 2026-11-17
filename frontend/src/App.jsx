import {useState, useEffect} from 'react'
import {supabase} from './lib/supabase'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import {Navigate, Route, Routes} from 'react-router-dom'
import {useProfile} from './hooks/useProfile'
import RoleHome from './components/RoleHome'
import RoleRoute from './components/RoleRoute'
import CustomerDashboard from './pages/CustomerDashboard'
import CourierDashboard from './pages/CourierDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App(){
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const {profile, error} = useProfile(session)


  useEffect(() => {
    //Check if the user is already logged in
    supabase.auth.getSession().then(({data}) => {
      setSession(data.session)
      setLoading(false)
    })


    //update whenever the user logs in or out
    const {data} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  if(loading) return <p>Loading...</p>

  //info route guards need to know abput the current user
  const auth = {session, profile, error}

  return (
    <Routes>

      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage/>}/>

      <Route path="/signup" element={session ? <Navigate to="/" replace/> : <SignupPage/>}/>

      <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

      //Opened from the reset email, which logs in with a short lived session
      <Route path="/reset-password" element={<ResetPasswordPage session={session}/>}/> 

      //Sends each user to their respecrtive dashboards
      <Route path="/" element={<RoleHome auth={auth}/>}/>

      //One dashboard per role
      <Route
        path="/customer"
        element={<RoleRoute auth={auth} role="customer"><CustomerDashboard profile={profile}/></RoleRoute>} 
      /> 

      <Route
        path="/courier"
        element={<RoleRoute auth={auth} role="courier"><CourierDashboard profile={profile}/></RoleRoute>}
      />

      <Route
        path="/admin"
        element={<RoleRoute auth={auth} role="admin"><AdminDashboard profile={profile}/></RoleRoute>}
      />

      //Unknown urls redirected to home
      <Route path="*" element={<Navigate to="/" replace/>}/>    
    </Routes>
  )
  
}
