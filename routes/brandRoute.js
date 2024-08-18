const express = require("express")
const {getAllBrand,getBrand,postBrand,updateBrand,deleteBrand,uploadImage,resizeUploadImage} = require("../controllers/brandController")

const {getBrandValidator,createBrandValidator,putBrandValidator,deleteBrandValidator} = require('../utils/validator/brandValidator')
const {protection,allowed} = require('../controllers/authController')

const router = express.Router()



router.route('/').get(getAllBrand).post(protection,allowed('admin','manager'),uploadImage,createBrandValidator,resizeUploadImage,postBrand)

router.route('/:id')
.get(getBrandValidator,getBrand)
.delete(protection,allowed('admin','manager'),deleteBrandValidator,deleteBrand)
.put(protection,allowed('admin','manager'),uploadImage,putBrandValidator,resizeUploadImage,updateBrand)





module.exports = router