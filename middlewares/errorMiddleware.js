
const errorHandler = (err, req, res, next) => {
    // console.log(err);
    if (err.name === "APIError") {

        res.status(err.status).json({
            message: err.message,
            code: err.status,
        });
    } else {
        res.status(500).json({
            message: err.message,
            code: 500,
        });
    }
    next();
}

export default errorHandler