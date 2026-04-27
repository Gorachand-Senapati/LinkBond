import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';


export default function NavBarComponent() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth)
  return (
    <div className={styles.container}>
     <nav className={styles.navBar}>
        {/* <h1 onClick={() => {
            router.push("/")
        }}>LinkBond</h1> */}
         <div className={styles.logoWrapper} onClick={() => router.push("/")}>
                    <img 
                        src="/images/logo.png" 
                        alt="LinkBond Logo" 
                        width={150} // Add a base width
                        height={50} // Add a base height
                        className={styles.logoImage}
                        
                    />
        </div>

        <div className={styles.navBarOptionContainer}>

            {authState.profileFetched && <div>
                <div style={{display:"flex", gap:"1.2rem"}}>
                    {/* <p >Hey,{authState.user.userId.name}</p> */}
                <p onClick={() => {
                    router.push("/profile")
                }} style={{fontWeight:"bold", cursor:"pointer"}}>Profile</p>
                <p onClick={() => {
                    localStorage.removeItem("token")
                    router.push("/")
                    dispatch(reset())
                }} style={{fontWeight:"bold", cursor:"pointer"}}>Logout</p>
                </div>
                </div>}

            {!authState.profileFetched && <div onClick={() => {
            router.push("/login")
        }} className={styles.buttonJoin}>
            <p>Be a Part</p>
        </div>}
            
        </div>
     </nav>
    </div>
  )
}
