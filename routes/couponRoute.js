const express = require("express")
const {postCoupon,getAllCoupon,getCoupon,deleteCoupon,updateCoupon} = require("../controllers/couponController")
const {protection,allowed} = require('../controllers/authController')

const router = express.Router()




router.use(protection,allowed('admin','manager'));

// body of the resquest must have filed 'image' to be consistent with fieldname .single('image')
router.route('/').get(getAllCoupon).post(postCoupon)

router.route('/:id')
.get(getCoupon)
.delete(deleteCoupon)
.put(updateCoupon)





module.exports = router