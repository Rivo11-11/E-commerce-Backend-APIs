
const slugify = require('slugify')
const {check,body} = require("express-validator")
const validation = require("../../middlewares/validationLayer")
const {checkDuplicateUser,checkOldPassword} = require('./validationDB');

// check is a keyword instead of using param-query-body . it replace them 

const changePasswordValidator = [
    check('id')
        .isMongoId().withMessage('Invalid User ID format'),
    check('oldPassword').notEmpty().withMessage('old password is required')
        .custom(checkOldPassword),
    check('password')
     .notEmpty().withMessage('new password of User is required')
     .custom((val,{req})=>{
            if ( val !== req.body.confirmPassword) {throw new Error('Password must equal Confirm Password')}
            return true
    }),
    check('confirmPassword').notEmpty().withMessage('confirm password of User is required'),
    
    validation()
]

const getUserValidator = [
    check('id')
        .isMongoId().withMessage('Invalid User ID format'),
    validation()
];
const putUserValidator = [
    check('id')
        .isMongoId().withMessage('Invalid User ID format'),
    body('name').optional().custom((val,{req})=>{
        req.body.slug  = slugify(val)
        return true
    }) ,

    body('email').optional()
    .notEmpty().withMessage('email of User is required').isEmail().withMessage('Not valid email address')
    .custom(checkDuplicateUser),

    body('role').optional() 
    .custom((val)=>{
        if (val !== 'admin' && val !== 'user')  { throw new Error('Invalid role')}
        return true
    }),
    body('phone').optional().isMobilePhone(["ar-EG" , "ar-SA"]).withMessage('Invalid phone number'),

    validation()
];
const deleteUserValidator = [
    check('id')
        .isMongoId().withMessage('Invalid User ID format'),
    validation()
];

const createUserValidator = [
    check('email')
        .notEmpty().withMessage('email of User is required').isEmail().withMessage('Not valid email address')
        .custom(checkDuplicateUser),

    check('password')
        .notEmpty().withMessage('password of User is required')
        .isLength({ min: 6 }).withMessage('name of User must be at least 6 characters long')
        .custom((val,{req})=>{
                if ( val !== req.body.confirmPassword) {throw new Error('Password must equal Confirm Password')}
                return true
        }),
   check('confirmPassword').notEmpty().withMessage('confirm password of User is required'),
    check('name')
        .notEmpty().withMessage('name of User is required')
        .isLength({ min: 3 }).withMessage('name of User must be at least 3 characters long')
        .isLength({ max: 15 }).withMessage('name of User must be at most 30 characters long')
        .custom((val,{req})=>{
            req.body.slug  = slugify(val)
            return true
        }),
    check('role').optional() 
    .custom((val)=>{
        const list = ['admin', 'user' , 'manager' ]
        if (!list.includes(val))  { throw new Error('Invalid role')}
        return true
    }),
    // accept only egyption and saudi numbers
    check('phone').optional().isMobilePhone(["ar-EG" , "ar-SA"]).withMessage('Invalid phone number'),
    validation()
];

module.exports = {
    getUserValidator,
    createUserValidator,
    putUserValidator,
    deleteUserValidator,
    changePasswordValidator
};
