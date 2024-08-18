const { validationResult } = require('express-validator');
const ApiError = require('../utils/errorClass');

const validation = (statuscode = 400) => (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ApiError(errorMessages.join(', '), statuscode);
    }
    next();
};

// module.exports  let you import the validation without destructuring...
module.exports = validation

