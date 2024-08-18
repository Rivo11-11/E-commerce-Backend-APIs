const {check} = require("express-validator")
const slugify = require('slugify')
const validation = require("../../middlewares/validationLayer")
const {checkDuplicateBrand} = require("./validationDB")




// Validators with specific error messages
const getBrandValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Brand ID format'),
    validation()
];

const putBrandValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Brand ID format'),
    check('name')
    .optional()
    .custom(checkDuplicateBrand)
    .custom((val,{req})=>{
        req.body.slug  = slugify(val)
        return true
    })  ,
    validation()
];
const deleteBrandValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Brand ID format'),
    validation()
];

const createBrandValidator = [
    check('name')
        .notEmpty().withMessage('name of Brand is required')
        .isLength({ min: 3 }).withMessage('name of Brand must be at least 3 characters long')
        .isLength({ max: 30 }).withMessage('name of Brand must be at most 30 characters long')
        .custom(checkDuplicateBrand) 
        .custom((val,{req})=>{
            req.body.slug  = slugify(val)
            return true
        })  ,
    validation()
];

module.exports = {
    getBrandValidator,
    createBrandValidator,
    putBrandValidator,
    deleteBrandValidator
};
