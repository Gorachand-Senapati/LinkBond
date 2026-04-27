import React, { act, useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { connect, useDispatch, useSelector } from 'react-redux';
import { acceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction';
import styles from "./index.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
export default function MyConnectionsPage() {
   
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) =>state.auth)
  //1st bring all connections
  useEffect(() => {
  dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));//whom sent me request
  },[]);

  useEffect(() => {
    if(authState.connectionRequests?.length != 0){
      console.log(authState.connectionRequests)
    }
  },[authState.connectionRequests]);


  return (
    <UserLayout>
              <DashboardLayout>
               <div style={{display:"flex", flexDirection:"column", gap:"1.7rem"}} >
                 <h4>My Connections</h4>
                 <div>
                  {authState.connectionRequests.length === 0 && <h1>No connection Request pending</h1>}
                 </div>
                 {authState.connectionRequests.length != 0 && authState.connectionRequests.filter((connection) => connection.status_accepted === null).map((user,index) =>{
                  return (
                    <div onClick={() =>{
                      router.push(`/view_profile/${user.userId.username}`);
                    }} className={styles.userCard} key={index}>
                      <div style={{display:"flex", alignItems:"center",gap:"1.2rem", justifyContent:"space-between"}}>
                        <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile"  />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        <button onClick={(e) =>{
                          e.stopPropagation();//not go the profile page
                          dispatch(acceptConnection({
                            connectionId: user._id, //connection id
                            token: localStorage.getItem("token"), //my token
                            action: "accept" //accept or reject
                          }))
                        }} className={styles.connectedButton}>Accept</button>
                      </div>
                    </div>
                  )
                 })}

                 <h4>My Network</h4>
                 {authState.connectionRequests.filter((connection) => connection.status_accepted !== null).map((user,index) =>{
                 return (
                   <div onClick={() =>{
                      router.push(`/view_profile/${user.userId.username}`);
                    }} className={styles.userCard} key={index}>
                      <div style={{display:"flex", alignItems:"center",gap:"1.2rem", justifyContent:"space-between"}}>
                        <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile"  />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        
                      </div>
                    </div>
                 )
                 })}
               </div>
              </DashboardLayout>
           </UserLayout>
  )
}
