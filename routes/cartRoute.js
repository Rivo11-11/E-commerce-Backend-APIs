const express = require("express")
const {addItem,getCart,removeItem,removeCart,updateQuantityMinus,updateQuantityPlus,applyCoupon} = require("../controllers/cartController")
const {protection,allowed} = require('../controllers/authController')

const router = express.Router()




router.use(protection,allowed('user'));

// body of the resquest must have filed 'image' to be consistent with fieldname .single('image')
router.route('/').post(addItem).get(getCart).delete(removeCart)

router.route('/:itemId')
.delete(removeItem)
router.put('/:itemId/plus',updateQuantityPlus)
router.put('/:itemId/minus',updateQuantityMinus)
router.post('/applyCoupon',applyCoupon)








module.exports = router