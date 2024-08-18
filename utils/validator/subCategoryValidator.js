const {check} = require("express-validator")
const slugify = require('slugify')
const validation = require("../../middlewares/validationLayer")
const {checkDuplicateSubcategory, checkCategory} = require("./validationDB")


const getSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid SubCategory ID format'),
    validation()
];
const putSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid SubCategory ID format'),
    check('name')
        .notEmpty().withMessage('name of SubCategory is required')
        .isLength({ min: 3 }).withMessage('name of SubCategory must be at least 3 characters long')
        .isLength({ max: 30 }).withMessage('name of SubCategory must be at most 30 characters long')
        .custom(checkDuplicateSubcategory) 
        .custom((val,{req})=>{
            req.body.slug  = slugify(val)
            return true
        })  ,
    check('category')
    .optional()
    .isMongoId().withMessage('Invalid Category ID format')
    .custom(checkCategory) ,
    validation()
];
const deleteSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid SubCategory ID format'),
    validation()
];

const createSubCategoryValidator = [
    check('name')
        .notEmpty().withMessage('name of SubCategory is required')
        .isLength({ min: 3 }).withMessage('name of SubCategory must be at least 3 characters long')
        .isLength({ max: 30 }).withMessage('name of SubCategory must be at most 30 characters long')
        .custom(checkDuplicateSubcategory) 
        .custom((val,{req})=>{
            req.body.slug  = slugify(val)
            return true
        }) ,
    check('category')
    .isMongoId().withMessage('Invalid Category ID format')
    .notEmpty().withMessage('Category field required') 
    .custom(checkCategory),
    validation()
];

module.exports = {
    getSubCategoryValidator,
    createSubCategoryValidator,
    putSubCategoryValidator,
    deleteSubCategoryValidator
};
