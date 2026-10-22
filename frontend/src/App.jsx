import {useState, useEffect} from 'react'
import {supabase} from './lib/supabase'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'

export default function App(){
  const [session, setSession] = useState(null)
  const [showSignup, setShowSignup] = useState(false)


  useEffect(() => {
    //Check if the user is already logged in
    supabase.auth.getSession().then(({data}) => setSession(data.session))


    //update whenever the user logs in or out
    const {data} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  if (session) return <HomePage session={session}/>

  return showSignup ? <SignupPage onShowLogin={() => setShowSignup(false)}/> 
  : <LoginPage onShowSignup={() => setShowSignup(true)}/>

  
}
