import mongoose from "mongoose";
import Post from "../model/postModel.js";
import { ObjectId } from 'mongodb'

export const generateFeed = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = req.user;
        const joinedCults = user.joinedCults;
        // if (joinedCults.length == 0) {

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
        const feed = await Post.aggregate([paginationStage1, paginationStage2, paginationStage3]);

        if (feed[0]) {
            return res.status(200).json({ data: feed[0], message: "top feed fetched" });
        }


        const obj = {
            feed: [],
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
        return res.status(200).json({ data: obj, message: "feed fetched" });

        // }
        // else {
        //     //joined cults
        //     // making the array of match queries

        //     //   {
        //     //     'cult': new ObjectId('6416ca7b9d5a2cd5ee453cd5')
        //     //   }, {
        //     //     'cult': new ObjectId('6416ca1f4fcdeb1b10ffff10')
        //     //   }
        //     let objCult = [];
        //     console.log(joinedCults);

        //     for (let i = 0; i < joinedCults.length; i++) {
        //         // console.log(joinedCults[i]);
        //         // const obj = { 'cult': joinedCults[i] };
        //         // objCult = { ...objCult, obj }
        //         // const objectId = `ObjectId('${joinedCults[i]}')`
        //         const objectId = String(joinedCults[i]);
        //         objCult.push({ 'cult': objectId });
        //     }
        //     // joinedCults.forEach((element) => {
        //     //     console.log(element);
        //     //     let obj = Object.assign(objCult, {
        //     //         'cult': new mongoose.Types.ObjectId(String(element))
        //     //     })
        //     // });
        //     console.log(objCult, "Final Ans");
        //     // const match = [
        //     //     {
        //     //         '$match': {
        //     //             '$or': objCult
        //     //         }
        //     //     }
        //     // ]


        //     // const match = [
        //     //     {
        //     //         $match: {
        //     //             $or: [
        //     //                 { user: new ObjectId('6416d433ffb710dc93a25666') },
        //     //                 // { cult: new ObjectId('6416ca1f4fcdeb1b10ffff10') }
        //     //             ]
        //     //         }
        //     //     }
        //     // ];

        //     const feed = await Post.aggregate(match);
        //     console.log(feed, "feed");
        //     res.status(200).json({ 'feed': feed })
        // }
    } catch (err) {
        next(err);
    }
}
