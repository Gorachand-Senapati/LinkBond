import { Router } from "express";
import { activeCheck } from "../controllers/posts.controller.js";//need to give .js
import multer from "multer";//for file upload
import { createPost, getAllPosts, deletePost,commentPost,get_comments_by_post,delete_comment_of_user, increment_like } from "../controllers/posts.controller.js";//for create post api

const router = Router();//make router
 const storage = multer.diskStorage({//for file upload
    destination:(req,file,cb)=>{
        cb(null,"uploads/");//folder name for upload
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);//for unique name of file
    }
 });

 const upload = multer({storage:storage});//for file upload
router.route('/').get(activeCheck);//api for active check

router.route("/post").post(upload.single('media'), createPost);//api for create post with file upload
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);//api for delete post
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_like);
export default router;//export router now it seen module wise in server.js and we can use it there 