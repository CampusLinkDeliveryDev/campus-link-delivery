import {useState} from 'react'
import {Link} from 'react-router-dom'
import {supabase} from '../lib/supabase'


export default function ForgotPasswordPage(){
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    async function handleSubmit(e){
        e.preventDefault()

        //Supabase emails a link that opens our /reset-password page
        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) {
            setMessage('Something went wrong, Please try again later.')
        }else {
            //same message for emails whether accounts exists or not, so emails cant be guessed
            setMessage('If an account exists for that email, a reset link has been sent')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>

            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />

            <button type="submit">Send reset link</button>

            {message && <p>{message}</p>}

            <p>
                <Link to="/login">Back to login</Link>
            </p>
        </form>
    )

}