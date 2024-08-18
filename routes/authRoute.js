const express = require("express")

const {signUp,login,updatePassword,forgetpassword,verifyCode,resetPassword} = require("../controllers/authController");
const {signUpValidator,changePasswordValidator,loginValidator,forgetpasswordValidator,verifycodeValidator, resetpasswordValidator} = require('../utils/validator/authValidator')

const router = express.Router()


router.route('/changePassword/:id').put(changePasswordValidator,updatePassword)

router.route('/signup').post(signUpValidator,signUp)

router.route('/login').post(loginValidator,login)

router.route('/forgetpassword').post(forgetpasswordValidator,forgetpassword)

router.route('/verifycode').post(verifycodeValidator,verifyCode)

router.route('/resetpassword').put(resetpasswordValidator,resetPassword)



module.exports = router