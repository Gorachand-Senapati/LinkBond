import { Router } from "express";
import { register, login, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, downloadResume, sendConnectionRequest ,getMyConnectionRequests, whatAreMyConnections,acceptConnectionRequest,getUserProfileAndUserBasedOnUsername} from "../controllers/user.controller.js";//need to give .js
import multer from "multer";//multer is a middleware for handling multipart/form-data, which is primarily used for uploading files. It makes it easy to handle file uploads in Node.js applications.
const router = Router();//make router

const storage = multer.diskStorage({ //This tells Multer to store uploaded files on disk (your server folder) instead of memory.
    destination: (req,file,cb) => { //This decides where the uploaded file will be saved. req= request obj,file= uploaded file,cb= callback function
        cb(null,'uploads/')//null = no error, 'uploads/' = folder name where file will be saved
    },
    filename:(req,file,cb)=> {  //This decides what name the file will have when saved.
        cb(null,Date.now() + "_" + file.originalname) //null = no error, Date.now() = current timestamp, file.originalname = original name of the uploaded file. This combination helps to ensure that each uploaded file has a unique name, preventing overwriting of files with the same name.
    }
}) 

const upload = multer({storage: storage})  //create an upload middleware using storage configuration defined above, this handle file uploading before it reach to controller
router.route("/update_profile_picture")  //upload one file with field name 'profile_picture' and then call uploadProfilePicture controller to handle the request
.post(upload.single('profile_picture'), uploadProfilePicture)  //this uploadprofilepicture go userController

router.route('/register').post(register);//api for active check
router.route('/login').post(login);//api for login

//after login , upload profile pic, then for update others thing like bio,education,work experience,skills etc we can create another api like /update_profile and then in that api we can update the user profile with the help of user id which we can get from the token after login.
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData );
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadResume);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername);
export default router;