import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import Profile from "../models/profile.js";
import Comment from "../models/comments.model.js";


export const activeCheck = async(req,res) =>{ //api create for active check
    return res.status(200).json({message:"active"});
}

export const createPost = async(req,res)=> {
    const {token} = req.body;

    try {
        const user = await User.findOne({token:token});//find user by token
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const post = new Post ({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split('/')[1]: ""  //for file type jpeg,png which came
            
        })

        await post.save();//save post in database
        return res.status(201).json({message:"Post created successfully", post:post});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllPosts = async(req,res) => {
    try{
        const posts = await Post.find().populate('userId', 'name username email profilePicture')
        return res.json({posts});
    } catch(err){
        return res.status(500).json({message: err.message })
    }
}

 export const deletePost = async(req, res) => {

    const {token , post_id} = req.body;
    try{
        const user = await User.findOne({token:token}).select("_id");//find user by token and select only _id field
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const post = await Post.findOne({_id: post_id});//find post by id and user id
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        if(post.userId.toString() !== user._id.toString()){//check post user id and user id
            return res.status(403).json({message:"You are not authorized to delete this post"});
        }//if I am not the owner of post then I can not delete it
        await Post.deleteOne({_id: post_id});//delete post by id
        return res.status(200).json({message:"Post deleted successfully"});

    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

export const commentPost = async(req,res) => {
    const {token, post_id, commentBody} = req.body;
    try{
        const user = await User.findOne({token:token}).select("_id");//find user by token and select only _id field
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const post = await Post.findOne({_id: post_id});//find post by id and user id
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        const comment = new Comment({
            userId: user._id,
            postId: post_id,
            body: commentBody
        })
        await comment.save();
        // Here you would typically add the comment to the post
        return res.status(200).json({message:"Comment added successfully"});
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
}

export const get_comments_by_post = async(req,res) => {
    const {post_id} = req.query;//fetch post id from request query

    try{
        const post = await Post.findOne({_id: post_id});//find post by id
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        const comments = await Comment.find({postId: post_id}) .populate("userId", "username name");
        return res.json(comments.reverse());//return comments of post

    } catch(error){
        return res.status(500).json({message: error.message})
    }

}

export const delete_comment_of_user = async(req, res) => {
    const {token , comment_id} = req.body;//in one post there are many comments but I want to delete only one comment so I will pass comment id and token in request body

    try{
        const user = await User.findOne({token:token}).select("_id");//find user by token and select only _id field
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const comment = await Comment.findOne({"_id": comment_id});//find comment by id
        if(!comment){
            return res.status(404).json({message:"Comment not found"});
        }
        if(comment.userId.toString() !== user._id.toString()){//check comment user id and user id
            return res.status(403).json({message:"You are not authorized to delete this comment"});
        }//if I am not the owner of comment then I can not delete it
        await Comment.deleteOne({"_id": comment_id});//delete comment by id
        return res.status(200).json({message:"Comment deleted successfully"});
    } catch(err) {
        return res.status(500).json({message: err.message})

    }
}

// export const increment_like = async(req,res) => {
//     const {post_id} = req.body;//fetch post id from request body
//     try{
//         const post = await Post.findOne({_id: post_id});//find post by id
//         if(!post){
//             return res.status(404).json({message:"Post not found"});
//         }
//         post.likes += 1;//increment like by 1
//         await post.save();//save post in database
//         return res.status(200).json({message:"Like incremented successfully", likes: post.likes});//return success message and total likes of post
//     }catch(err) {
//         return res.status(500).json({message: err.message})
//     }
// }

export const increment_like = async (req, res) => {
    const { post_id, token } = req.body;

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        //  Check if already liked
        if (post.likedBy.includes(user._id)) {
            return res.status(400).json({ message: "Already liked" });
        }

        // Add like
        post.likes += 1;
        post.likedBy.push(user._id);

        await post.save();

        return res.status(200).json({
            message: "Liked successfully",
            likes: post.likes
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};