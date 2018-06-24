function RequestError(status, message) {
    this.name = 'RequestError';
    this.status = status;
    this.message = message || `Request failed with status ${status}`;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, RequestError);
    } else {
        this.stack = (new Error()).stack;
    }
}
RequestError.prototype = Object.create(Error.prototype);
RequestError.prototype.constructor = RequestError;

const errors = {
    RequestError,
};

module.exports = errors;
