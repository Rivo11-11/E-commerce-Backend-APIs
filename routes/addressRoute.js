const express = require("express")
const {addAddress, getAddress,removeAddress} = require("../controllers/addressController")

const {protection,allowed} = require('../controllers/authController')

const router = express.Router()


// apply these 2 middleware on the below routes
router.use(protection,allowed('user'));

router.route('/').post(addAddress).get(getAddress).delete(removeAddress)





module.exports = router