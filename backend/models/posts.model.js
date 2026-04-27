import mongoose, { Schema } from 'mongoose';
const PostSchema = new Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        body: {
            type: String,
            required: true
        }, 
        likes: {
            type: Number,
            default:0
        },
        likedBy: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
   ] ,
        createdAt:{
            type: Date,
            default: Date.now
        },
        updateAt: {
             type: Date,
             default: Date.now
        },
        media: {
            type: String,
            default: ''
        },
        active: {
            type: Boolean,
            default: true
        },
        fileType: {
            type: String,
            default: ''
        }
    }
);
const Post = mongoose.model('Posts', PostSchema);//defining user model
export default Post;//exporting user model to use in other files