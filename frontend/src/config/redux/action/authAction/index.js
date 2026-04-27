import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Exo } from "next/font/google";
import { connect } from "react-redux";


export const loginUser = createAsyncThunk(
    "user/login", //action type prefix (used to generate pending/fulfilled/rejected action types)
    async (user, thunkAPI) => {//user = input data from login form, thunkAPI = provides access to dispatch, getState, etc.
        try{
            const response = await clientServer.post(`/login` ,{//sending post request to backend login endpoint with user credentials
                email: user.email, //taking email and password from user input and sending to backend for authentication
                password: user.password
            });
            if(response.data.token) { //if backend returns a token, save it in local storage for future authenticated requestsn successful login
                localStorage.setItem("token", response.data.token);
            }else{//send error if token is not received from backend, which means login failed
                return thunkAPI.rejectWithValue({message:"Login failed: No token received"});
            }
            return thunkAPI.fulfillWithValue(response.data.token); //send success result (token) to fulfiled case in reducer for further processing (e.g., saving user info in state)
        } catch(error) {//if API fails, send error data to rejected case in reducer for error handling (e.g., showing error message to user)
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try{
            const request = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name:user.name
            })
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getAboutUser = createAsyncThunk(
    
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try{
           console.log(user);
            const response = await clientServer.get("/get_user_and_profile", {
                params: { //this is get so
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(_, thunkAPI) => {
        try{
            const response = await clientServer.get("/user/get_all_users")
            return thunkAPI.fulfillWithValue(response.data)
        } catch (err){
             return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


//connection 4 functions
export const sendConnectionRequest = createAsyncThunk(//sent connection request
    "user/sendConnectionRequest",
    async(user, thunkAPI) => {
        try{
            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,//from login token- amr token
                connectionId:user.user_id //I sent whom- jake ami request pathachi tar id

            })
            thunkAPI.dispatch(getConnectionsRequest({token: user.token})) //after sent request i want to update my connection list so i call getConnectionRequest api to update my connection list in frontend
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)

export const getConnectionsRequest = createAsyncThunk( //i sent request to whomse connection request ami pathaisi tar list pete
    "user/getConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/getConnectionRequests",{
                params: {
                    token: user.token //my token
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            console.log(error)
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)

export const getMyConnectionRequest = createAsyncThunk(
    "user/getMyConnectionRequest",
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.get("/user/user_connection_request",{
                params:{
                    token: user.token //my token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)

export const acceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.post("/user/accept_connection_request",{
                token: user.token,//my token
                requestId: user.connectionId, //who sent me request
                action_type: user.action //accept or reject
            });
            thunkAPI.dispatch(getConnectionsRequest({token: user.token})) //after accept/reject request i want to update my connection list so i call getConnectionRequest api to update my connection list in frontend
            thunkAPI.dispatch(getMyConnectionRequest({token: user.token})) //after accept/reject request i want to update my connection request list so i call getMyConnectionRequest api to update my connection request list in frontend
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)