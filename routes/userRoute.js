const express = require("express")
const {getAllUser,getUser,postUser,updateUser,deleteUser,uploadImage,resizeUploadImage,updatePassword,logged,update} = require("../controllers/userController")


const {getUserValidator,createUserValidator,putUserValidator,deleteUserValidator,changePasswordValidator} = require('../utils/validator/userValidator')
const {protection,allowed} = require('../controllers/authController')

const router = express.Router()




// protection pass the user data to the logged, and logged assign the params for getUser
router.get('/logMe',protection,logged,getUser)
router.put('/updatePassword',protection,logged,changePasswordValidator,updatePassword)
router.put('/update',protection,logged,uploadImage,putUserValidator,resizeUploadImage,update)


// apply these 2 middleware on the below routes
router.use(protection,allowed('admin','manager'));

router.route('/changePassword/:id').put(changePasswordValidator,updatePassword)

router.route('/').get(getAllUser).post(uploadImage,createUserValidator,resizeUploadImage,postUser)

router.route('/:id')
.get(getUserValidator,getUser)
.delete(deleteUserValidator,deleteUser)
.put(uploadImage,putUserValidator,resizeUploadImage,updateUser)



module.exports = router