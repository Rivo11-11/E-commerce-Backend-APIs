const slugify = require('slugify')
const productModel = require('../models/productModel')
const {deleteDocument,getDocument,getAllDocument,updateDocument,createDocument} = require('./factoryHandler')
const {postMixImage,resizeMixImage} = require('../middlewares/uploadImage')

const Images = [
    {name : 'imageCover', maxCount : 1} ,
    {name : 'images' , maxCount : 3 }
]
const imageConfig = {
    imageCover: {single: true },
    images: {single: false }
  };

const uploadImages =  postMixImage(Images)

const resizeUploadImages = resizeMixImage('products',imageConfig)


// access : private (admin-manager)
const postProduct = async (req,res) => {
    req.body.slug = slugify(req.body.title)
    const product = await createDocument(productModel,req.body)
    res.status(201).json({data : product})
    } 



// access : public
const getAllProduct= async (req,res) => {
    const [products,page,limit,total] = await getAllDocument(productModel.find(),req.query,['title'])
    res.status(200).json({result : products.length,page,totalPages: Math.ceil(total / limit * 1.0) , data : products})
   }
  

// access : public
const getProduct = async (req, res) => {
    // add the reviews populate
    const product = await getDocument(productModel,'Product',req.params.id,'reviews')
    res.status(200).json(product)
   
    
}



// access : private (admin-manager)
const deleteProduct = async (req,res) => {
    const product = await deleteDocument(productModel,'Product' ,req.params.id)
    res.status(200).json(product)
}

// access : private (admin-manager)
const updateProduct = async (req,res) => {
    const product = await updateDocument(productModel,'Product',req.params.id,req.body)
    res.status(200).json(product)

}
module.exports = {
    postProduct , 
    getAllProduct, 
    getProduct,
    deleteProduct,
    updateProduct,
    uploadImages,
    resizeUploadImages

}