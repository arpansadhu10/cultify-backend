import mongoose from "mongoose";
import Comment from "../model/commentModel.js";
import Cult from "../model/cultModel.js";
import Like from "../model/likesModel.js";
import Post from "../model/postModel.js";
import APIError from "../utils/APIError.js";


export const createPost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { image, description, cult } = req.body;
        //check if cult is present or not
        const isCultPresent = await Cult.findById(cult);
        if (!isCultPresent) {
            throw new APIError("please select valid cult", 404);
        }
        const post = await Post.create({
            user: userId,
            image: image,
            description,
            cult,
        });
        res.status(200).json({ data: post, message: 'Post created' });

    } catch (err) {
        next(err);
    }
}

export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({});
            // return res.status(200).json({ data: { posts: posts }, message: "posts fetched" });
        if (!posts) {
            throw new APIError("Post Not Found", 404);
        }
        console.log(posts);
        return res.status(200).json({ data: posts , message: "All posts fetched" });

    } catch (err) {
        next(err);
    }
}

export const likePost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        console.log(userId);
        const boolLike = req.body.like;
        const postId = req.body.post;
        const isAlreadyLiked = await Like.findOne({ post: postId, user: userId });
        if (boolLike === true) {
            //check if post already liked
            if (!isAlreadyLiked) {
                await Like.create({
                    user: userId,
                    post: postId,
                });
                //increase like count by 1;
                const posts = await Post.findById(postId);
                posts.likes += 1;
                posts.save();
                return res.status(200).json({ message: 'Post liked' });
            }
            return res.status(200).json({ message: 'Post liked' });
        } else {
            if (isAlreadyLiked) {
                await Like.deleteOne({
                    user: userId,
                    post: postId,
                });
                const posts = await Post.findById(postId);
                if (posts.likes > 0) {
                    posts.likes -= 1;
                    posts.save();
                }

                return res.status(200).json({ message: 'Post disliked' });
            } else {

                return res.status(200).json({ message: 'Post disliked' });
            }
        }
    } catch (err) {
        next(err);
    }
}

export const getLikesOfAPost = async (req, res, next) => {
    try {
        const postId = req.params.post;
        const post = await Post.findById(postId);
        console.log(post);
        if (!post) {
            throw new APIError("Post Not Found", 404);
        }
        console.log(post.likes);
        return res.status(200).json({ data: post.likes, message: "Likes fetched" });

    } catch (err) {
        next(err);
    }
}
export const getCommentsNumberOfAPost = async (req, res, next) => {
    try {
        const postId = req.params.post;
        const post = await Post.findById(postId);
        console.log(post);
        if (!post) {
            throw new APIError("Post Not Found", 404);
        }
        console.log(post.likes);
        return res.status(200).json({ data: post.numberOfComments, message: "Number of comments fetched" });

    } catch (err) {
        next(err);
    }
}

export const createCommentOnAPost = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const postId = req.body.post;
        const post = await Post.findById(postId);
        console.log(post);
        if (!post) {
            throw new APIError("Post Not Found", 404);
        }
        const comment = req.body.comment;
        const createComment = await Comment.create({
            comment,
            post: postId,
            user: userId
        });
        return res.status(200).json({ data: createComment, message: "Comment created" });

    } catch (err) {
        next(err);
    }
}

export const getAllCommentsOfAPost = async (req, res, next) => {
    try {
        const postId = req.params.post;
        const post = await Post.findById(postId);
        console.log(post);
        if (!post) {
            throw new APIError("Post Not Found", 404);
        }


        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit, 10);
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        console.log(page, limit);
        const paginationOptions = { page, limit }
        const skip = limit * (page - 1);
        const paginationStage1 = {
            $facet: {
                total: [
                    {
                        $count: 'createdAt',
                    },
                ],
                data: [
                    {
                        $addFields: {
                            _id: '$_id',
                        },
                    },
                ],
            },
        };
        const paginationStage2 = {
            $unwind: '$total',
        };
        const paginationStage3 = {
            $project: {
                comments: {
                    $slice: ['$data', skip, limit],
                },
                pagination: {
                    totalDocs: '$total.createdAt',
                    hasPrevPage: {
                        $gt: [skip / limit, 0],
                    },
                    hasNextPage: {
                        $gt: [
                            {
                                $ceil: {
                                    $divide: ['$total.createdAt', limit],
                                },
                            },
                            {
                                $add: [skip / limit, 1],
                            },
                        ],
                    },
                    prevPage: {
                        $cond: {
                            if: {
                                $gt: [skip / limit, 0],
                            },
                            then: skip / limit,
                            else: null,
                        },
                    },
                    nextPage: {
                        $cond: {
                            if: {
                                $gt: [
                                    {
                                        $ceil: {
                                            $divide: ['$total.createdAt', limit],
                                        },
                                    },
                                    {
                                        $add: [skip / limit, 1],
                                    },
                                ],
                            },
                            then: {
                                $add: [skip / limit, 2],
                            },
                            else: null,
                        },
                    },
                    limit: {
                        $literal: limit,
                    },
                    pagingCounter: {
                        $add: [skip / limit, 1],
                    },
                    totalPages: {
                        $ceil: {
                            $divide: ['$total.createdAt', limit],
                        },
                    },
                },
            },
        };
        const postObjectId = new mongoose.Types.ObjectId(postId)
        const matchParam =
        {
            '$match': {
                'post': postObjectId
            }
        }
        console.log(matchParam);
        const comments = await Comment.aggregate([
            matchParam,
            paginationStage1, paginationStage2, paginationStage3

        ]);
        console.log(comments);
        console.log(comments);
        if (comments[0]) {
            return res.status(200).json({ data: comments[0], message: "comments fetched" });
        }


        const obj = {
            comments: [],
            pagination: {
                totalDocs: 0,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
                limit: paginationOptions.limit,
                pagingCounter: paginationOptions.page,
                totalPages: 1,
            },
        };







        return res.status(404).json({ data: obj, message: "No comments found" });

    } catch (err) {
        next(err);
    }
}