const {check} = require("express-validator")
const validation = require("../../middlewares/validationLayer")
const {checkProduct,checkUnique,checkReview} = require("./validationDB")



// Validators with specific error messages
const getReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Review ID format'),
    validation()
];

const putReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Review ID format')
        .custom(checkReview),

    validation()
];
const deleteReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Review ID format')
        .custom(checkReview),

    validation()
];

const createReviewValidator = [
    check('title')
        .isLength({ min: 3 }).withMessage('Review must be at least 3 characters long')
        .isLength({ max: 200 }).withMessage('Review must be at most 200 characters long'),
    check('product')
        .notEmpty().withMessage('Product is required')
        .isMongoId().withMessage('Invalid Product ID format')
      // custom take a promise
      .custom(checkProduct)
      .custom(checkUnique),

    // authentication do this job
    // check('user')
    //     .notEmpty().withMessage('User is required')
    //     .isMongoId().withMessage('Invalid User ID format')
    //   // custom take a promise
    //   .custom(checkUser),

    check('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validation()
];

module.exports = {
    getReviewValidator,
    createReviewValidator,
    putReviewValidator,
    deleteReviewValidator
};
