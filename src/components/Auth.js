import {auth, googleProvider} from '../config/firebase'
import {createUserWithEmailAndPassword, signInWithPopup, signOut, signInWithEmailAndPassword} from 'firebase/auth'
import {useState} from "react";

export function Auth (){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    console.log(auth?.currentUser?.email)

    async function signIn(){
        try{
            console.log('signing in...')
            await createUserWithEmailAndPassword(auth, email, password)
            console.log('signed in')
        }catch (err){
            console.error(err)
            console.log('unable to sign in')
        }
    }

    async function logIn(){
        try{
            console.log('login in...')
            await signInWithEmailAndPassword(auth, email, password)
            console.log('logged in')
        }catch (err){
            console.error(err)
            console.log('unable to sign in')
        }
    }

    async function signInWithGoogle(){
        try{
            await signInWithPopup(auth, googleProvider)
        }catch (err){
            console.error(err)
        }
        console.log('signing in with google...')
    }

    async function logout(){
        try{
            await signOut(auth)
        }catch (err){
            console.error(err)
        }
        console.log('signing out...')
    }

    return (
        <div className={'Auth'}>
            <input type="email"
                   placeholder={'Email...'}
                   value={email}
                   onChange={e => setEmail(e.target.value)}
            />
            <input type="text"
                   placeholder={'Password...'}
                   value={password}
                   onChange={e => setPassword(e.target.value)}
            />
            <button onClick={signIn}>Sign In</button>

            <button onClick={logIn}>Log In</button>

            <button onClick={signInWithGoogle}>Google</button>

            <button onClick={logout}>Sign Out</button>
        </div>
    )
}