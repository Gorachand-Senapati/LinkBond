import { BASE_URL, clientServer } from '@/config';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userProfile}) {
    
    const searchParamers = useSearchParams();
    const router = useRouter();
    const postReducer = useSelector((state) => state.postReducer);
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);//auth reducer

    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);//1st not in conections
    const [isConnectionNull, setIsConnectionNull] = useState(true);
     
    const getUserPost = async() => {
      await dispatch(getAllPosts());//so i seen it recent activity
      await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
      await dispatch(getMyConnectionRequest({token: localStorage.getItem("token")}));
    }
   useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username //if farhan ko raju ne connection accept kar diya to farhan ke post raju ke profile me show honge but agar raju ne farhan ko connection accept nahi kiya to farhan ke post raju ke profile me show nahi honge
    })
    setUserPosts(post);//userpost see in the profile page
   }, [postReducer.posts])




//teacher use effect for connection status
useEffect(()=>{
  console.log(authState.connections, userProfile?.userId._id)
  if(authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){//if user is in connection list of auth state then set isCurrentUserInConnection to true
    setIsCurrentUserInConnection(true);
    if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true){//if status accepted is true then set isConnectionNull to false
      setIsConnectionNull(false);
    }
  }
  //if a user accept the request then authomatically in both connected accepted and connection request list status will be updated so we can check in both list if user is there or not and then we can set the connection status in frontend
   if(authState.connectionRequests.some(user => user.userId._id === userProfile.userId._id)){//if user is in connection request list of auth state then set isCurrentUserInConnection to true
    setIsCurrentUserInConnection(true);
    if(authState.connectionRequests.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){//if status accepted is true then set isConnectionNull to false
      setIsConnectionNull(false);
    }
  }
}, [authState.connections, authState.connectionRequests])

    useEffect(() => {
        getUserPost();
    }, [])
  return (
    <div>
      <UserLayout>
     <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="profilepic" />
              
          </div>
          <div className={styles.profileContainer__details}>
           <div className={styles.profileContainer__flex}>
            <div style={{flex:"0.8rem"}}>
              <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
                <h2>{userProfile.userId.name}</h2>
                <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                

              </div>
              <p style={{color:"grey"}}>{userProfile.currentPost}</p>
              <div style={{display:"flex", alignItems:"center" ,gap:"1rem"}} >
                {
                isCurrentUserInConnection ? <button className={styles.connectedButton}>{isConnectionNull ? "Pending":"Connected"}</button> 
                : <button onClick={() => {
                  dispatch(sendConnectionRequest({token: localStorage.getItem("token"), user_id: userProfile.userId._id}))
                }} className={styles.connectBtn}>Connect</button>
                }
               <div onClick={async() => {
                 // Handle download click
                 const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                 window.open(`${BASE_URL}/${response.data.message}`, "_blank")
               }} style={{cursor:"pointer" ,alignItems:"center", marginTop:"1rem"}}>
                <svg style={{width:"1.4em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                 </svg>

                </div>
              </div>
             
              <div>
                <p>{userProfile.bio}</p>
              </div>
            </div>
            <div style={{flex:"0.2rem"}}>
              <h3>Recent Activity</h3>
              {userPosts.map((post)=>{
                return (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card__profileContainer}>
                        {post.media !== "" ?<img src={`${BASE_URL}/${post.media}`}alt=""/>
                        : <div style={{width:"3.4rem", height:"3.4rem"}}></div>}
                      </div>
                      <p>{post.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
           </div>
          </div>

          <div className="workHistory">
            <h4>Work History </h4>
            <div className={styles.workHistoryContainer}>
              {
                userProfile.pastWork.map((work, index) =>{
                  return(
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{fontWeight:"bold", display:"flex",alignItems:"center", gap:"0.8rem"}}>
                        {work.position} at {work.company}
                      </p>
                      <p>From {work.years} years</p>
                    </div>
                  )
                })
              }
            </div>
          </div>

           <div className="workHistory">
            <h4>Education</h4>
            <div className={styles.workHistoryContainer}>
              {
                userProfile.education.map((edu, index) =>{
                  return(
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{fontWeight:"bold", display:"flex",alignItems:"center", gap:"0.8rem"}}>
                        {edu.degree} in {edu.fieldOfStudy} at {edu.school}
                      </p>
                      
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
     </DashboardLayout>
     </UserLayout>
    </div>
  )
}

//serverside rendering for get user profile based on username which we will get from url in next js we can use getServerSideProps and then in that we can call the api to get the user profile based on username and then pass that data to the component as props and then we can use that data to display the user profile in the component.
export async function getServerSideProps(context) {//this function will run on server side and then it will fetch the user profile based on username from url and then pass that data to the component as props
  
  const request = await clientServer.get("/user/get_profile_based_on_username", {//call api to get user profile based on username
    params: {
      username: context.query.username //fetch username from url and then pass it to api to get user profile based on username
    }
  })

  const response = await request.data;//fetch response from api and then pass it to component as props
  console.log("response from server", response);
  return {
    props: {
     userProfile: request.data.profile //pass user profile data to component as props and then we can use that data to display user profile in component
    }
  }
}
