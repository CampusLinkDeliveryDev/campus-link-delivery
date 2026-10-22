import {useState} from 'react'
import {supabase} from '../lib/supabase'


export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleLogin(e){
        e.preventDefault()

        const {error} = await supabase.auth.signInWithPassword({email, password})
        if (error) {
            setError('Invalid email or password')

        }

        //App detects successful logins and redirect to home page 
    }

    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>

            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Log In</button>

            {error && <p>{error}</p>}
        </form>
    )
}
