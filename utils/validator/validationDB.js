/* eslint-disable no-unused-expressions */
// const { check } = require('express-validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');

const CategoryModel = require('../../models/categoryModel')
const BrandModel = require('../../models/brandModel')
const SubcategoryModel = require('../../models/subCategoryModel')
const ProductModel = require('../../models/productModel')
const UserModel = require('../../models/userModel')
const APIerror = require('../errorClass');

const checkCategory = async (categoryId) => {
    const category = await CategoryModel.findById(categoryId)
    // will be catched in the validation layer ==> validation layer will customized it using API ERROR .
    // and will pass it to the next middleware until will be catched by our global handler error middleware with 4 parameters
    // you can throw an error or use promise.reject both do the job
    if (!category ) throw new Error('No category found with this id');
};
 
 const checkDuplicateCategory = async (name) => {
    const category = await CategoryModel.find({name}) 
    if (category.length > 0 ) throw new Error('Duplicate category name') ;

}

const checkDuplicateSubcategory = async (name) => {
    const subcategory = await SubcategoryModel.find({name}) 
    if (subcategory.length > 0 ) throw new Error('Duplicate subcategory name') ;

}

const checkDuplicateProduct = async (title) => {
    const product = await ProductModel.find({title}) 
    if (product.length > 0 ) throw new Error('Duplicate product title name') ;

}


const checkDuplicateBrand = async (name) => {
    const brand = await BrandModel.find({name}) 
    if (brand.length) throw new Error('Duplicate brand name') ;

}

const checkSubcategory = async (subcategoryId,{req}) => {
    const subcategories = await SubcategoryModel.find({ _id: { $in: subcategoryId } });
    const notFoundIds = subcategoryId.filter(id => !subcategories.some(subcategory => subcategory._id.equals(id)));
    if (notFoundIds.length > 0) {
        throw new Error(`No Subcategory found with these ids: ${notFoundIds.join(', ')}`);
    }
   // i want to check that all subcategories in subcategoryId are related to the category given
   const ids = await SubcategoryModel.find({category : req.body.category })
   const subcategoryIds = ids.map(subcategory => subcategory._id.toString());
   if (!subcategoryId.every(id => subcategoryIds.includes(id))) {
       throw new Error('Some subcategories are not related to the given category');
   }
}

const checkDuplicateUser = async (email) => {
    const emails = await UserModel.find({email}) 
    if (emails.length) throw new Error('Duplicate Email') ;

}

const checkOldPassword = async (oldPassword = '',{req}) => {
    const user = await UserModel.findById(req.params.id) 
    const res = await bcrypt.compare(oldPassword, user.password)
    if (!res) throw new APIerror('Incorrect old Password') ;
   
}
const checkEmail = async (val,{req}) => {
    const user = await UserModel.findOne({ 'email' : val }, '_id password name email');
    if(!user) throw new APIerror('Incorrect email',404) ;
    req.body._id = user._id 
    req.body.encrypted = user.password
    req.body.name = user.name 
    req.body.email = user.email
}


// special check email only for forgetpassword route
// const checkEmail2 = async (val,{req}) => {
//     const user = await UserModel.findOne({ 'email' : val }, '_id password name email');
//     if(!user) throw new APIerror('Email does not exist',404) ;
//     req.user = user
// }

const checkPassword = async (val,{req}) => {
    const res = await bcrypt.compare(req.body.password, req.body.encrypted)
    // 401 unauthorized
    if(!res) throw new APIerror('Incorrect password',401) ;
}
module.exports = {
    checkCategory,
    checkDuplicateCategory,
    checkDuplicateBrand,
    checkSubcategory,
    checkDuplicateSubcategory,
    checkDuplicateProduct,
    checkDuplicateUser,
    checkOldPassword,
    checkEmail,
    checkPassword
}