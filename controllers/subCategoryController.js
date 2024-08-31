const subCategoryModel = require('../models/subCategoryModel')
const {deleteDocument,getAllDocument,createDocument,getDocument,updateDocument} = require('./factoryHandler')

// to help me pass the validation layer when the category is not provided in body
const setIdIntoBody = (req, res, next) => {
    if (!req.body.category ) req.body.category = req.params.id
    next()
}


const setFilterObj = (req, res, next) => {

    let filterObj = {} 
    if (req.params.id ) filterObj = {category : req.params.id} 
    req.filterObj = filterObj
    next()
}


// access : private (admin-manager)
const postSubCategory = async (req,res) => {
        const subcategory = await createDocument(subCategoryModel,req.body)
        res.status(201).json({data : subcategory})
} 
    

// access : public
const getAllSubCategory= async (req,res) => {
    const [subcategories,page,limit,total] = await getAllDocument(subCategoryModel.find(req.filterObj),req.query,['name' , 'slug'])
    res.status(200).json({result : subcategories.length,page,totalPages: Math.ceil(total / limit * 1.0) , data : subcategories})
  
}

// access : public
const getSubCategory = async (req, res) => {
    const subcategory = await getDocument(subCategoryModel,'SubCategory',req.params.id)
    res.status(200).json(subcategory)
    
}



// access : private (admin-manager)
const deleteSubCategory = async (req,res) => {
    const subcategory = await deleteDocument(subCategoryModel,'Subcategory' , req.params.id)
    res.status(200).json(subcategory)
}

// access : private (admin-manager)
const updateSubCategory = async (req,res) => {
    const subcategory= await updateDocument(subCategoryModel,'SubCategory',req.params.id,req.body)
    res.status(200).json(subcategory)

}

module.exports = {
    postSubCategory , 
    getAllSubCategory, 
    getSubCategory,
    deleteSubCategory,
    updateSubCategory,
    setIdIntoBody,
    setFilterObj

}