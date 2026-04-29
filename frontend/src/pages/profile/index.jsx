import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { use, useEffect, useState } from 'react'
import styles from "./index.module.css";
import { BASE_URL, clientServer } from '@/config';
import { getAboutUser } from '@/config/redux/action/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { useRouter } from 'next/router';
import { current } from '@reduxjs/toolkit';


export default function ProfilePage() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);
  const router = useRouter();
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    const [inputData, setInputData] = useState({company:"", position:"", years:""});
   const handleWorkInputChange = (e) =>{
    const {name, value}= e.target;
    setInputData({...inputData, [name]: value});//dynamic input change handler for work history form
   }

   const [isEducationModelOpen,setIsEducationModelOpen] = useState(false);
   const [educationData, setEducationData] = useState({school:"", degree:"", fieldOfStudy:""});

   const handleEducationInputChange = (e) =>{
    const {name, value}= e.target;
    setEducationData({...educationData, [name]: value});//dynamic input change handler for education form
   }

  const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(getAboutUser({token: localStorage.getItem("token")}));//get about user for profile page
        dispatch(getAllPosts());//get all post for recent activity in profile page
    },[])

    useEffect(()=>{
       
         if (authState.user != undefined){
           setUserProfile(authState.user);
            let post = postReducer.posts.filter((post) => {
           return post.userId.username === authState.user.userId.username //if farhan ko raju ne connection accept kar diya to farhan ke post raju ke profile me show honge but agar raju ne farhan ko connection accept nahi kiya to farhan ke post raju ke profile me show nahi honge
        })
        setUserPosts(post);//userpost see in the profile page
         }
        
    }, [authState.user, postReducer.posts])
  
  
    const updateProfilePicture = async (file)=>{
      const formData = new FormData();
      formData.append("profile_picture", file);//append file to formdata with key profile_picture
      formData.append("token", localStorage.getItem("token"));//append token to formdata with key token

      const response = await clientServer.post("/update_profile_picture", formData,{
        headers: {
          "Content-Type": "multipart/form-data"//set content type to multipart/form-data for file upload
        }
      });
      dispatch(getAboutUser({token: localStorage.getItem("token")}));//after update profile picture get about user for profile page
    }

    const updateProfileData = async () =>{
      const request = await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name,
        username: userProfile.userId.username
      })

      const response = await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork,
        education: userProfile.education,
      });

      dispatch(getAboutUser({token: localStorage.getItem("token")}));//after update profile data get about user for profile page
    }

  return (
    <UserLayout>
        <DashboardLayout>
            {authState.user && userProfile?.userId &&
            <div className={styles.container}>
          <div className={styles.backDropContainer}>
           <label htmlFor='profilePic_upload' className={styles.backDrop__overlay}>
            <p>Edit</p>
           </label>
           <input onChange={(e) =>{
            updateProfilePicture(e.target.files[0]);//need file upload photho
           }} hidden type='file' id='profilePic_upload'/>
             <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="profilepic" />
           
              
          </div>
          <div className={styles.profileContainer__details}>
           <div className={styles.profileContainer__flex}>
            <div style={{flex:"0.8rem"}}>
              <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
                {/* <h2>{userProfile.userId.name}</h2> */}
                <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) =>{
                  setUserProfile({...userProfile, userId: {...userProfile.userId, name:e.target.value}})
                }}/>
                {/* <p contentEditable style={{color:"grey"}}>@{userProfile.userId.username}</p> */}
                <input 
 
                 type="text" 
                 value={userProfile.userId.username} 
                 onChange={(e) => {
                   setUserProfile({
                     ...userProfile, 
                     userId: { ...userProfile.userId, username: e.target.value }
                   });
                 }} 
                />
                

              </div>
              <input 
                className={styles.inputField} // Using the same class you used in your modals
                type="text" 
                value={userProfile.currentPost || ""} 
                placeholder="Enter your current position (e.g., Software Engineer)"
                onChange={(e) => {
                  setUserProfile({...userProfile, currentPost: e.target.value})
                }}
                />
             
              
             
              <div>
                <textarea name="bio" id="bio" value={userProfile.bio} onChange={(e) =>{
                  setUserProfile({...userProfile, bio:e.target.value})
                }} rows={Math.max(3,Math.ceil(userProfile.bio.length /80))} //adjust rows based on content length
                ></textarea> 
              </div>
            </div>
            <div className={styles.recentActivitySection} style={{flex:"0.2rem"}}>
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
              <button className={styles.addWorkBtn} onClick={() =>{
                setIsModalOpen(true);
              }}> Add Work</button>
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
              <button className={styles.addWorkBtn} onClick={() =>{
                setIsEducationModelOpen(true);
              }}> Add Education</button>
            </div>
          </div>

          {userProfile != authState.user && 
          <div onClick={() =>{
            updateProfileData();
          }} className={styles.updateProfileBtn}> Update Profile
            </div>
            }
        </div>
    }


            {isModalOpen && 
                <div 
                  onClick={() =>{
                    setIsModalOpen(false);//after click any part of background comment box gone
                  }}
                className={styles.commentsContainer}>
                   <div
                   onClick={(e) => {
                    e.stopPropagation();//if click middle of comments not go
                   }}
                   className={styles.allCommentsContainer}>
                    <input onChange={handleWorkInputChange} name="company" className={styles.inputField} type="text" placeholder='Enter Company' />
                    <input onChange={handleWorkInputChange} name="position" className={styles.inputField} type="text" placeholder='Enter Position' />
                    <input onChange={handleWorkInputChange} name="years" className={styles.inputField} type="number" placeholder='Enter Years' />
                    <div onClick={() => {
                      // Handle add work logic here
                      setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]});//add new work to past work array in user profile
                      setIsModalOpen(false);//after add work close modal
                    }} className={styles.updateProfileBtn}>
                      Add Work
                    </div>
    
                   </div>
                </div>
                }

                {isEducationModelOpen && 
                <div 
                  onClick={() =>{
                    setIsEducationModelOpen(false);//after click any part of background comment box gone
                  }}
                className={styles.commentsContainer}>
                   <div
                   onClick={(e) => {
                    e.stopPropagation();//if click middle of comments not go
                   }}
                   className={styles.allCommentsContainer}>
                    <input onChange={handleEducationInputChange} name="school" className={styles.inputField} type="text" placeholder='Enter School' />
                    <input onChange={handleEducationInputChange} name="degree" className={styles.inputField} type="text" placeholder='Enter Degree' />
                    <input onChange={handleEducationInputChange} name="fieldOfStudy" className={styles.inputField} type="text" placeholder='Enter Field of Study' />
                    <div onClick={() => {
                      // Handle add work logic here
                      setUserProfile({...userProfile, education: [...userProfile.education, educationData]});//add new work to past work array in user profile
                      setIsEducationModelOpen(false);//after add work close modal
                    }} className={styles.updateProfileBtn}>
                      Add Education
                    </div>
    
                   </div>
                </div>
                }
        </DashboardLayout>
    </UserLayout>
  )
}
