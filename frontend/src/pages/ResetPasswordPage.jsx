import {useState} from 'react'
import {Link} from 'react-router-dom'
import {supabase} from '../lib/supabase'

//The email link logs in user with a short lived session, so they can set a new password
export default function ResetPasswordPage({session}){
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [message, setMessage] = useState('')
    const [done, setDone] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()

        if (password !== confirm) {
            setMessage('Passwords do not match')
            return
        }

        const {error} = await supabase.auth.updateUser({password})

        if(error){
            setMessage(error.message)
        }else{
            setMessage('Password updated')
            setDone(true)
        }
    }

    if(!session){
        return (
            <div>
                <h1>Reset Password</h1>
                <p>This link is invalid or has expired</p>
                <Link to="/forgot-password">Request a new link</Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Reset Password</h1>

            <input
                type="password"
                placeholder="new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
            />

            <input
                type="password"
                placeholder='confirm password'
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={6}
                required
            />

            <button type="submit" disabled={done}>Save password</button>

            {message && <p>{message}</p>}

            {done && <Link to="/">Continue</Link>}
        </form>
    )
}