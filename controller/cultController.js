import Cult from "../model/cultModel.js";
import User from "../model/userModel.js";
import APIError from "../utils/APIError.js";

export const createCult = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const doesAlreadyExists = await Cult.findOne({ name: name });
        if (doesAlreadyExists) {
            throw new APIError("cult Already exists", 409);
        }

        const cult = await Cult.create({
            name: name,
            description: description,
            image: req.body.image,
        })
        res.status(200).json({ data: cult, message: "cult created successfully" });
    } catch (err) {
        next(err);
    }
}

export const getAllCults = async (req, res, next) => {
    try {
        const search = req.query.search;
        if (search === undefined) {
            const cults = await Cult.find({});
            return res.status(200).json({ data: { cults: cults }, message: "cult fetched" });
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
                cults: {
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
        const searchParam =
        {
            $match: {
                $or: [
                    {
                        name: {
                            $regex: search,
                            '$options': 'i',
                        },
                    },
                    {
                        description: {
                            $regex: search,
                            '$options': 'i',
                        },
                    },


                ],

            },
        };

        const cults = await Cult.aggregate([
            searchParam,
            paginationStage1, paginationStage2, paginationStage3

        ]);
        console.log(cults);
        if (cults[0]) {
            return res.status(200).json({ data: cults[0], message: "top cults fetched" });
        }


        const obj = {
            cults: [],
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
        return res.status(404).json({ data: obj, message: "No cults found" });

    } catch (err) {
        next(err);
    }
}

export const getTopCults = async (req, res, next) => {
    try {
        console.log(req.query.page, req.query.limit);
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
                cults: {
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
        const sort = {
            '$sort': {
                'numberOfPeopleJoined': -1
            }
        }
        const topCults = await Cult.aggregate([
            sort,
            paginationStage1, paginationStage2, paginationStage3

        ]);
        console.log(topCults);
        if (topCults[0]) {
            return res.status(200).json({ data: topCults, message: "top cults fetched" });
        }


        const obj = {
            cults: [],
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
        return res.status(404).json({ data: obj, message: "No cults found" });


    } catch (err) {
        next(err);
    }
}


export const joinCult = async (req, res, next) => {
    try {
        const cultId = req.params.cult;
        const cult = await Cult.findById(cultId);
        if (!cult) {
            throw new APIError("Cult not found", 404);
        }
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            throw new APIError("User not found", 404);
        }
        let flag = false;
        user.joinedCults.map((i) => {
            if (String(i) === String(cultId)) {
                flag = true;
                throw new APIError("Already added", 400);
            }
        });
        user.joinedCults.push(cultId);
        await user.save();
        //increment cult joined count

        cult.numberOfPeopleJoined += 1;
        await cult.save();
        res.status(200).json({ data: user, message: "user added to cult" });

    } catch (err) {
        next(err);
    }
}
export const leaveCult = async (req, res, next) => {
    try {
        const cultId = req.params.cult;
        const cult = await Cult.findById(cultId);
        if (!cult) {
            throw new APIError("Cult not found", 404);
        }
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            throw new APIError("User not found", 404);
        }


        let flag = -1;
        user.joinedCults.map((i, index) => {
            if (String(i) === String(cultId)) {
                flag = index;
            }
        });
        if (flag === -1) {
            throw new APIError("user not added to cult", 400);
            // return res.status(200).json({ data: user, message: "user added to cult" });

        }
        user.joinedCults.splice(flag, 1);
        await user.save();

        //increment cult joined count
        if (cult.numberOfPeopleJoined > 0) {
            cult.numberOfPeopleJoined -= 1;
            await cult.save();
        }
        return res.status(200).json({ data: user, message: "user deleted from cult" });

    } catch (err) {
        next(err);
    }
}



