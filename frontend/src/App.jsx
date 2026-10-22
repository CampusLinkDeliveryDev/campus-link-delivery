import {useState, useEffect} from 'react'
import {supabase} from './lib/supabase'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

export default function App(){
  const [session, setSession] = useState(null)


  useEffect(() => {
    //Check if the user is already logged in
    supabase.auth.getSession().then(({data}) => setSession(data.session))


    //update whenever the user logs in or out
    const {data} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  return session ? <HomePage session={session}/> : <LoginPage />
}
