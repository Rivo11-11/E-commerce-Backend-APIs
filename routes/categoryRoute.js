const express = require("express")
const {postCategory,getAllCategory,getCategory,deleteCategory,updateCategory,uploadImage,resizeUploadImage} = require("../controllers/categoryController")
const subcategories = require("./subCategoryRoute")
const {getCategoryValidator,createCategoryValidator,putCategoryValidator,deleteCategoryValidator} = require('../utils/validator/categoryValidator')
const {protection,allowed} = require('../controllers/authController')

const router = express.Router()




// nested route access subcategories of a specific category
router.use('/:id/subcategories',subcategories)


// body of the resquest must have filed 'image' to be consistent with fieldname .single('image')
router.route('/').get(getAllCategory).post(protection,allowed('admin','manager'),uploadImage, createCategoryValidator,resizeUploadImage,postCategory)

router.route('/:id')
.get(getCategoryValidator,getCategory)
.delete(protection,allowed('admin','manager'),deleteCategoryValidator,deleteCategory)
.put(protection,allowed('admin','manager'),uploadImage,putCategoryValidator,resizeUploadImage,updateCategory)





module.exports = router