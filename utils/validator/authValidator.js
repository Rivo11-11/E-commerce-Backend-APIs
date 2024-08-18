
const slugify = require('slugify')
const {check} = require("express-validator")
const validation = require("../../middlewares/validationLayer")
const  {checkDuplicateUser,checkOldPassword,checkEmail,checkPassword} = require("./validationDB");


// check is a keyword instead of using param-query-body . it replace them 



const signUpValidator = [
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
    validation()
];
const loginValidator = [
    check('email')
        .notEmpty().withMessage('email of User is required').isEmail().withMessage('Not valid email address')
        .custom(checkEmail),

    check('password')
        .notEmpty().withMessage('password of User is required')
        .custom(checkPassword),
    validation(401)
];
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
    
    validation(401)
]

const forgetpasswordValidator = [
    check('email')
        .notEmpty().withMessage('email of User is required').isEmail().withMessage('Not valid email address'),
    validation()
];

const verifycodeValidator = [
    check('reset_code')
    .notEmpty().withMessage('reset_code is required'),
validation()
];

const resetpasswordValidator = [
    check('email')
        .notEmpty().withMessage('email of User is required').isEmail().withMessage('Not valid email address'),
    check('password')
        .notEmpty().withMessage('password of User is required')
        .isLength({ min: 6 }).withMessage('name of User must be at least 6 characters long')
        .custom((val,{req})=>{
                if ( val !== req.body.confirmPassword) {throw new Error('Password must equal Confirm Password')}
                return true
        }),
   check('confirmPassword').notEmpty().withMessage('confirm password of User is required'),
    validation()
];



module.exports = {
   signUpValidator,
   changePasswordValidator,
   loginValidator,
   forgetpasswordValidator,
   verifycodeValidator,
   resetpasswordValidator
};
