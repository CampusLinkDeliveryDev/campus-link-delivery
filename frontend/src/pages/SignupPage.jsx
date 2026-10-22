import {useState} from 'react'
import {supabase} from '../lib/supabase'


const Phone_Regex = /^\+?[0-9 ()-]{7,20}$/
export default function SignupPage({onShowLogin}){
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('customer')
    const [message, setMessage] = useState('')

    async function handleSignup(e){
        e.preventDefault()

        //Check database rules
        if(!email.toLowerCase().endsWith('@rdpolytech.ca')){
            setMessage('Use your @rdpolytech.ca email')
            return
        }

        if (phone && !Phone_Regex.test(phone)){
            setMessage('Enter a valid phone number')
        }


        //extra fields goes in to user metadata
        // handle_new_user trigger copies new users into profiles table
        const{data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data : {full_name: fullName.trim(), phone: phone.trim(), role},
            },
        })

        //error message when supabase encounters an error
        if (error){
            setMessage(error.message)
        }else if (role === 'courier'){
            setMessage('Account created. An admin needs to approve couriers before you can deliver')
        } else if (!data.session){
            //Email confirmatiuon is on, no session until they click the link
            setMessage('Check your email to confirm yor account')
        }

        //When link clicked they can see the session data
    }


    return(
        <form onSubmit={handleSignup}>
            <h1>Create account</h1>

            <input
                type="text"
                placeholder="Fullname"
                value={fullName}
                onChange={(e)=> setFullName(e.target.value)}
                maxLength={100}
                required
            />

            <input
                type="email"
                placeholder="email (@rdpolytech.ca)"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
            />

            <input
                type="tel"
                placeholder="phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                minLength={6}
                required
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">customer</option>
                <option value="courier">courier</option>
            </select>
            
            <button type="submit">Sign up</button>

            {message && <p>{message}</p>}


            <p>
                Already have an account? 
                <button type="button" onClick={onShowLogin}>Log in</button>
            </p>

        </form>
    )

}