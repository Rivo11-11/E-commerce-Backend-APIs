
const slugify = require('slugify')
const {check,body} = require("express-validator")
const validation = require("../../middlewares/validationLayer")
const {checkDuplicateCategory} = require('./validationDB');

// check is a keyword instead of using param-query-body . it replace them 


// Validators with specific error messages
const getCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Category ID format'),
    validation()
];
const putCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Category ID format'),
    body('name').optional().custom((val,{req})=>{
        req.body.slug  = slugify(val)
        return true
    }) ,
    validation()
];
const deleteCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Category ID format'),
    validation()
];

const createCategoryValidator = [
    check('name')
        .notEmpty().withMessage('name of Category is required')
        .isLength({ min: 3 }).withMessage('name of Category must be at least 3 characters long')
        .isLength({ max: 30 }).withMessage('name of Category must be at most 30 characters long')
        // custom work as a middlware to create the slug from the name .. instead of making a middleware we can use this option
        .custom((val,{req})=>{
            req.body.slug  = slugify(val)
            return true
        }) 
        .custom(checkDuplicateCategory),
    validation()
];

module.exports = {
    getCategoryValidator,
    createCategoryValidator,
    putCategoryValidator,
    deleteCategoryValidator
};
