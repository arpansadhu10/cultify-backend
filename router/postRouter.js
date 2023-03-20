import { Router } from "express";
import { createCommentOnAPost, getAllPosts, createPost, getAllCommentsOfAPost, getCommentsNumberOfAPost, getLikesOfAPost, likePost } from "../controller/postController.js";
import { auth } from "../middlewares/authMiddleware.js";



const PostRouter = Router();

PostRouter.post('/', auth, createPost);
PostRouter.get('/', getAllPosts);
PostRouter.post('/like', auth, likePost);
PostRouter.get('/:post/likes', auth, getLikesOfAPost);
PostRouter.get('/:post/comments', auth, getCommentsNumberOfAPost);
PostRouter.get('/:post/comments/details', auth, getAllCommentsOfAPost);
PostRouter.post('/:post/comments', auth, createCommentOnAPost);

export default PostRouter;