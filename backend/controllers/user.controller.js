import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import Profile from "../models/profile.js";
import httpStatus from "http-status";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataToPDF = async(userData) =>{
   const doc = new PDFDocument;//import from pdf kit which is used to create pdf file in node js
   const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";//create random name for pdf file with crypto
   const stream = fs.createWriteStream(`uploads/${outputPath}`);

    doc.pipe(stream);//pipe the document to the stream, which will write the PDF data to the specified file path.\
    doc.image(`uploads/${userData.userId.profilePicture}`, {align: "center", width: 100});//add profile picture in pdf with center align and width 100
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);//add name in pdf with font size 14
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);//add username in pdf with font size 14
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);//add email in pdf with font size 14
    doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);//add bio in pdf with font size 14 if bio is not exist then add N/A
    
    // doc.fontSize(14).text(`Education: ${userData.education || "N/A"}`);//add education in pdf with font size 14 if education is not exist then add N/A
  
    doc.fontSize(14).text("Education: ");
     userData.education.forEach((edu) => {
         doc.fontSize(14).text(`${edu.degree} in ${edu.fieldOfStudy} at ${edu.school}`);
     });
    doc.fontSize(14).text(`Current Position: ${userData.currentPost || "N/A"}`);//add work experience in pdf with font size 14 if work experience is not exist then add N/A
    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work,index) => {
        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
    })
    doc.end();
    return outputPath;
}

export const register = async(req,res) => {
    console.log(req.body);
    try{
        const {name ,email, password, username} = req.body;
        if(!name || !email || !password || !username) return res.status(400).json({message: "All field are required"});

        const  user = await User.findOne({ //check user alredy in db or not
            email
        })
        if(user) return res.status(400).json({message: "User already exists"});

        const hashedPassWord = await bcrypt.hash(password,12);//makeing hash password with 12 salt
        const newUser = new User ({
            name,
            username,
            email,
            password: hashedPassWord,

        });

        await newUser.save();//save in userDb
        //when new user save we automaticaly make profile for him/her
        const newProfile = new Profile({
            userId: newUser._id,
            name: newUser.name,
        });
        await newProfile.save();
        return res.status(201).json({message:"User created Scuccessfully"});
    } catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const login = async(req,res) => {
    const {email,password} = req.body;//fetch username and password from req.body
    if(!email || !password){//if not give this input and try login
        return res.status(400).json({message:"Username and password required"});
    }
    try{
        const user = await User.findOne({email});//fidn username in db
        if(!user){//not exist
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found"});
        }
        let isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "wrong email or password"});
        }
        const token = crypto.randomBytes(32).toString("hex");//create token for login with crypto

        await User.updateOne({_id: user._id},{ token});//save token in userDb for login
        return res.json({token : token});//return token to frontend for save in local storage and use for authentication
    } catch (error){
        return res.status(500).json({message:`something went wrong${error}`});
    }
}

export const uploadProfilePicture = async(req,res) => {
    const {token} = req.body;//fetch token from req.body

    try {

        const user = await User.findOne({token: token});//find user with token
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.profilePicture = req.file.filename;//save file name in userDb
        await user.save();
        return res.json({message: "Profile picture updated successfully"});
    } catch(error) {
        return res.status(500).json({message: `something went wrong ${error}`});
    }
}

export const updateUserProfile = async(req,res) =>{

     try {
        const {token, ...newUserData} = req.body;//fetch token from req.body ... is spread operator
        const user = await User.findOne({token: token});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const {username, email} = newUserData;//here speread operator came all update data here

        const existingUser = await User.findOne({ $or: [{username}, {email}] });//check username or email alredy exist in db or not

        if(existingUser){
            if(existingUser && String (existingUser._id) !== String(user._id)){//if exist but not same user then return error
                return res.status(400).json({message: "Username or email already exists"});
            }
            
        }
        Object.assign(user, newUserData);
        await user.save();//save the new updated 
        return res.json({message: "user updated"});

        
    } catch(error) {
        return res.status(500).json({message: `something went wrong ${error}`});
    }
}

export const getUserAndProfile = async(req,res) => {
    try{
        // const {token} = req.body;//fetch token from req.body
         const {token} = req.query;
       const user = await User.findOne({token: token});//find user with token
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const userProfile = await Profile.findOne({userId: user._id})
        .populate('userId', 'name username email profilePicture');//populate userId with name,username,email,profilePicture from userDb
        return res.json(userProfile);
    } catch(error) {
        return res.status(500).json({message: `something went wrong ${error}`});
    }
}

export const updateProfileData = async(req,res) => {
    try {
        const {token, ...newProfileData} = req.body;//fetch token from req.body ... is spread operator
        const userProfile = await User.findOne({token: token});
        if(!userProfile){
            return res.status(404).json({message: "User profile not found"});
        } 

        const profile_to_update = await Profile.findOne({userId: userProfile._id})
        Object.assign(profile_to_update, newProfileData);//now assign old value now new
        await profile_to_update.save();
        return res.json({message: "Profile updated successfully"});
      } catch(error) {
        return res.status(500).json({message: `something went wrong ${error}`});
    }   
}

export const getAllUserProfile = async(req,res) => {
    try{
        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');
        return res.json(profiles);
    } catch(error) {
        return res.status(500).json({message: `something went wrong ${error}`});
    }  
 }

 export const downloadResume = async(req,res) => {
    const user_id = req.query.id;//Get user id from request It reads the id from query parameters.
    const userProfile = await Profile.findOne({userId: user_id}).populate('userId', 'name username email profilePicture');
    //here work 2 things 1. find profile with userId and 2. populate userId with name,username,email,profilePicture from userDb
    let outputPath = await convertUserDataToPDF(userProfile);//Convert data into PDF /uploads/resume.pdf
    return res.json({ "message": outputPath });

 }


 export const sendConnectionRequest = async(req,res) => {
    const {token , connectionId} = req.body;//fetch token and connectionId from req.body

    try{
        const user = await User.findOne({token: token});//find user with token
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const connectionUser = await User.findOne({_id: connectionId});//find user with connectionId whom I sent request
        if(!connectionUser){
            return res.status(404).json({message: "Connection user not found"});
        }
        //check if already in my connection request or not
        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        })
        if(existingRequest){
            return res.status(400).json({message:"Request already sent"})
        }
        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id,
            status_accepted: null
        });
        await request.save();
        return res.json({message: "Connection request sent successfully"
        })
    }catch(error){
        return res.status(500).json({message: `something went wrong ${error}`});
    }
 }

 export const getMyConnectionRequests = async(req, res) => {
    //const {token} = req.body;
    const {token} = req.query;
    try{
        const user = await User.findOne({token: token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const connections = await ConnectionRequest.find({userId: user._id})//any body sent connection on my userId
        .populate('connectionId', 'name username email profilePicture');
        return res.json(connections);//return all connection request with user details who sent me request
    }catch(err){
        return res.status(500).json({message:err.message});
    }
 }

 export const whatAreMyConnections = async(req,res) => {

    //  const {token} = req.body;
     const {token} = req.query;
    try{
        const user = await User.findOne({token: token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const connections = await ConnectionRequest.find({connectionId: user._id})// see who sent me request on connectionId
        .populate('userId', 'name username email profilePicture');//populate userId with name,username,email,profilePicture from userDb
        
        return res.json(connections);//return all connection request with user details who sent me request

    }catch(err){
         return res.status(500).json({message:err.message});
    }
 }

 //accepted the connection request
 export const acceptConnectionRequest = async(req,res) => {
    const {token, requestId, action_type} = req.body;
    try{
        const user = await User.findOne({token: token});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const connection = await ConnectionRequest.findOne({_id: requestId});//find connection request with requestId and connectionId
        if(!connection){
            return res.status(404).json({message:"Connection request not found"});
        }
        if(action_type === "accept"){
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;//remove from connection request if reject the request
        }
        await connection.save();
        return res.json({message:"Request updated successfully"});
    }catch(err){
         return res.status(500).json({message:err.message});
    }
 }

 export const getUserProfileAndUserBasedOnUsername = async(req,res) => {
    const {username} = req.query;
    try{
        const user = await User.findOne({
            username
        });
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const userProfile = await Profile.findOne({userId:user._id})
        .populate('userId', 'name username email profilePicture');
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        return res.json({"profile":userProfile});
    }catch(error){
        return res.status(500).json({message: `something went wrong ${error}`});

    }
 }