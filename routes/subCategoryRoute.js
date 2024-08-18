const express = require("express")
const subCategoryController = require("../controllers/subCategoryController")


const {getSubCategoryValidator,createSubCategoryValidator,putSubCategoryValidator,deleteSubCategoryValidator} = require('../utils/validator/subCategoryValidator')
const {protection,allowed} = require('../controllers/authController')

// mergeParams allow us to access params from other routers mofida fel nested routes
// in our case i want to access categoriy id from categories end point route
const router = express.Router({mergeParams: true})

router.route('/').get(subCategoryController.setFilterObj,subCategoryController.getAllSubCategory).post(protection,allowed('admin','manager'),subCategoryController.setIdIntoBody,createSubCategoryValidator,subCategoryController.postSubCategory)

router.route('/:id')
.get(getSubCategoryValidator,subCategoryController.getSubCategory)
.delete(protection,allowed('admin','manager'),deleteSubCategoryValidator,subCategoryController.deleteSubCategory)
.put(protection,allowed('admin','manager'),putSubCategoryValidator,subCategoryController.updateSubCategory)





module.exports = router