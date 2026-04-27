
/**
* STEPS for state management with Redux:
*Submit Action
*Handle Action in Reducer
*Register here -> Reducer
*/

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"; // Import the auth reducer to manage authentication-related state
import postReducer from "./reducer/postReducer"

 export const store = configureStore({
    reducer: {
        auth: authReducer, // Register auth reducer to handle authentication-related state
        postReducer: postReducer
    }
})