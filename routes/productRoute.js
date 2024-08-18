const express = require("express")
const {getProduct,getAllProduct,postProduct,updateProduct,deleteProduct,uploadImages,resizeUploadImages} = require("../controllers/productController")

const {getProductValidator,createProductValidator,putProductValidator,deleteProductValidator} = require('../utils/validator/productValidator')
const {protection,allowed} = require('../controllers/authController')

const router = express.Router()


router.route('/').get(getAllProduct).post(protection,allowed('admin','manager'),uploadImages,createProductValidator,resizeUploadImages,postProduct)

router.route('/:id')
.get(getProductValidator,getProduct)
.delete(protection,allowed('admin','manager'),deleteProductValidator,deleteProduct)
.put(protection,allowed('admin','manager'),uploadImages,putProductValidator,resizeUploadImages,updateProduct)





module.exports = router