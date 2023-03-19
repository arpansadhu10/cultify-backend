import Cult from "../model/cultModel.js";
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
        const cults = await Cult.find({});
        res.status(200).json({ data: cults, message: "cult fetched" });

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


        return {
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

    } catch (err) {
        next(err);
    }
}

