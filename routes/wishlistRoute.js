const express = require("express")
const {addProduct,removeProduct, getWishList} = require("../controllers/wishlistController")

const {protection,allowed} = require('../controllers/authController')

const router = express.Router()


// apply these 2 middleware on the below routes
router.use(protection,allowed('user'));

router.route('/').post(addProduct).delete(removeProduct).get(getWishList)




module.exports = router