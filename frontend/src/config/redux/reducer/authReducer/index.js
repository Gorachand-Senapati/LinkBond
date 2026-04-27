import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequest, loginUser,registerUser } from "../../action/authAction"

const { createSlice } = require("@reduxjs/toolkit") //import createSlice from redux toolkit


const initialState = {// Initial state of the auth slice (default values)
    user: null,  // Stores user data (initially empty) also []
    isError: false, //track if any error occurred during authentication process
    isSuccess: false, //track if authentication process was successful
    isLoading: false, //track if the authentication process is currently loading
    loggedIn: false, //track if the user is currently logged in
    message: "", // Stores messages for user feedback
    isTokenThere: false,
    profileFetched: false, //track if the user's profile has been fetched
    connections: [], //store user connections (initially empty)
    connectionRequests: [], //store connection requests (initially empty)
    all_users: [],
    all_profiles_fetched: false
}

const authSlice = createSlice({ //create auth slice using createSlice function from redux toolkit
    name: "auth",// Name of the slice (used in Redux store)
    initialState, // Attach initial state
    reducers: {
        reset: () => initialState, //reset state back to initial state
        handleLoginUser: (state) => { //curstom reducer to update message
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false
        }
    },

    extraReducers: (builder) => { //handle's async actions (like API calls) related to authentication
        builder.addCase(loginUser.pending, (state) => {  // When login API is called (pending state)
            state.isLoading = true // Start loading
            state.message = "Knocking the door ..." // Show loading message
        })
        // When login API is successful
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false//stop loading
            state.isError = false //clear any previous error
            state.isSuccess = true //mark success
            state.loggedIn = true //mark user as logged in
            state.message = "Welcome to LinkBond" //success message
        })
          // When login API fails
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false // Stop loading
            state.isError = true // Mark error
            state.message = action.payload //// Store error message
        })

        //for register user action, we will add similar cases using builder

        .addCase(registerUser.pending, (state) => {
            state.isLoading = true 
             state.message = "Registering you ..."
        })
        // When registerAPI is successful
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false//stop loading
            state.isError = false //clear any previous error
            state.isSuccess = true //mark success
            state.loggedIn = false //mark user after go log in
            state.message = {
                message:"Register Successfull . please Sign In" //success message
            }
        })
          // When login API fails
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false // Stop loading
            state.isError = true // Mark error
            state.message = action.payload //// Store error message
        })
        .addCase(getAboutUser.fulfilled, (state,action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            // state.user = action.payload.profile;
            // action.payload IS the profile object from your backend
    // We want the name/email which is inside action.payload.userId
    state.user = {
        ...action.payload,
        name: action.payload.userId?.name,
        username: action.payload.userId?.username,
        email: action.payload.userId?.email,
        profilePicture: action.payload.userId?.profilePicture
    };
            
        })
        .addCase(getAllUsers.fulfilled,(state,action) => {
            state.isLoading = false
            state.isError = false
            state.all_profiles_fetched = true
            // Map through the users and ensure userId exists to prevent frontend crashes
            state.all_users = action.payload.map(profile => ({
                ...profile,
                // Fallback to empty object if userId is missing
                userId: profile.userId || { name: "Unknown User" } 
            }));
        })
        .addCase(getConnectionsRequest.fulfilled, (state, action) => {
            state.connections = action.payload || [] //who is my current connections
        })
        .addCase(getConnectionsRequest.rejected,(state, action) =>{
            state.message = action.payload
        })
        .addCase(getMyConnectionRequest.fulfilled,(state,action) =>{
            state.connectionRequests = action.payload
        })
        .addCase(getMyConnectionRequest.rejected,(state,action) =>{
            state.message = action.payload
        })

      
        
    }
})

export const {reset, emptyMessage,setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer // Export reducer to use in store

/* initialState → default data
reducers → sync updates
extraReducers → async actions (API calls)
pending → loading
fulfilled → success
rejected → error */