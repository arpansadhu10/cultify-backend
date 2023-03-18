
class APIError extends Error {
    status;

    constructor(message, status) {
        super(message);
        this.name = 'APIError';
        this.status = status;

        Error.call(this, message);
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

export default APIError;
