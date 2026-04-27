import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'
export default function LoginComponent() {

  const authState = useSelector((state) => state.auth)
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod,setUserLoginMethod] = useState(false);
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName]= useState("");
   useEffect (() => {
    if(authState.loggedIn) {
      router.push("/dashboard")
    }
   }, [authState.loggedIn])

  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  }, []);//run on intial
  
  useEffect(() => {
  // ✅ after successful register → go to login
  if(authState.isSuccess && !userLoginMethod){
    setUserLoginMethod(true); // switch UI to Sign In
  }
}, [authState.isSuccess]);

   useEffect(() => {
   dispatch(emptyMessage());//seen empty message when go sign in page
   },[userLoginMethod])

   const handleRegister = ()=>{
    console.log("registering ...");
    dispatch(registerUser({username,password,email,name}));
   }

   const handleLogin =()=>{
    console.log("log in ..");
    dispatch(loginUser({email, password}));
   }

  return (
    <UserLayout>

    <div className={styles.container}>
       <div className={styles.cardContainer}>
         <div className={styles.cardContainer__left}>
           <p className={styles.cardleft__heading}>{userLoginMethod ? "Sign In" : "Sign Up" }</p>
           <p style={{color: authState.isError ? "red" :"green"}}>{authState.message.message}</p>
           <div className={styles.inputContainers}>
           {!userLoginMethod && <div className={styles.inputRow}>
               <input onChange={(e) => {setUsername(e.target.value)}} className={styles.inputField} type="text" placeholder='Username' />
             <input  onChange={(e) => {setName(e.target.value)}} className={styles.inputField} type="text" placeholder='Name' />
            </div>}
             <input  onChange={(e) => {setEmailAddress(e.target.value)}} className={styles.inputField} type="text" placeholder='Email' />
             <input  onChange={(e) => {setPassword(e.target.value)}} className={styles.inputField} type="text" placeholder='Password' />

             <div onClick={() => {
              if(userLoginMethod){//login
                handleLogin();
              } else{ //handleregister
                handleRegister();
              }
             }} className={styles.buttonWithOutline}>
              <p>{userLoginMethod ? "Sign In" :" Sign Up"}</p>
             </div>
           </div>
          
         </div>
         <div className={styles.cardContainer__right}>
          <div>
            {userLoginMethod ? <p>Don't Have an Account?</p> : <p>Already Have an Account ?</p>}
           <div onClick={() => {
             setUserLoginMethod(!userLoginMethod);
             }} style={{ marginTop:"1.2rem", color:"black", textAlign:"center", justifyContent:"center"}} className={styles.buttonWithOutline}>
              <p>{userLoginMethod ? "Sign Up" :" Sign In"}</p>
             </div>
          </div>
         </div>
     </div>
    </div>
    </UserLayout>
  )
}
