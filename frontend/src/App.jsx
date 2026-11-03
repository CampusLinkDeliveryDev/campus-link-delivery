import {useState, useEffect} from 'react'
import {supabase} from './lib/supabase'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import {Navigate, Route, Routes} from 'react-router-dom'

export default function App(){
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)


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

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage/>}/>

      <Route path="/signup" element={session ? <Navigate to="/" replace/> : <SignupPage/>}/>

      <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

      //Opened from the reset email, which logs in with a short lived session
      <Route path="/reset-password" element={<ResetPasswordPage session={session}/>}/> 


      // Only logged in users can see the home page
      <Route path="/" element={session ? <HomePage session={session}/> : <Navigate to="/login" replace/>}/>

      //Unknown urls redirected to home
      <Route path="*" element={<Navigate to="/" replace/>}/>    
    </Routes>
  )
  
}
