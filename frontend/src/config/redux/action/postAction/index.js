import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk( //submit Action
    "post/getAllPosts",
    async(_, thunkAPI) => {
        try{
            const response = await clientServer.get('/posts')
            return thunkAPI.fulfillWithValue(response.data)
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async(userData, thunkAPI) => {// Async function that runs when action is dispatched
        const {file,body} = userData;// Destructure file and body from userData

        try{
            const formData = new FormData();//create formdata to send file + text
            formData.append('token', localStorage.getItem('token')) //for authentication add token
            formData.append('body', body) //add post text
            formData.append('media',file) //add media img,vido

            const response = await clientServer.post("/post", formData, {  // Send POST request to backend
                headers: {  // Specify content type for file upload
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 200) {//if success ful
                return thunkAPI. fulfillWithValue("Post Uploaded")
            } else{//if reject
                return thunkAPI.rejectWithValue("Post not upload")
            }
        } catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id, thunkAPI) => {
        try{
            const response = await clientServer.delete("/delete_post", {
                data: {
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id
                }
            });
            return thunkAPI.fulfillWithValue(response.data)
        } catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const incrementPostLike= createAsyncThunk(
    "post/incrementLike",
    async (post, thunkAPI) => {
        try{
            const response = await clientServer.post(`/increment_post_like`, {
                post_id: post.post_id,
                 token: localStorage.getItem("token") //for authentication fetch token from local storage
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getAllComments = createAsyncThunk(
    "post/geAllComments", // Action type (used in reducers)
    async(postData,thunkAPI) =>{ // Async function that runs when this action is dispatched
        try{ // Send GET request to backend to fetch comments
            const response = await clientServer.get("/get_comments", {
                params:{// Pass post_id as query parameter
                    post_id: postData.post_id
                }
            })
            return thunkAPI.fulfillWithValue({//if successful
                comments: response.data, //store the comments
                post_id: postData.post_id // Also return post_id to identify which post's comments these are

            })
        } catch(error) {
            return thunkAPI.rejectWithValue("Something went wrong")
        }
    }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
        try{
            console.log({
                post_id: commentData.post_id,
                body: commentData.body
            })
            const response = await clientServer.post("/comment", {// Send POST request to backend to add a comment
                token: localStorage.getItem("token"),//for authentication fetch token from local storage
                post_id: commentData.post_id, // Pass post_id to identify which post to comment on
                commentBody: commentData.body // Pass the comment text
            })
            return thunkAPI.fulfillWithValue(response.data);
        } catch(error){
            return thunkAPI.rejectWithValue("something went wrong");
        }
    }
)