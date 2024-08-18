const slugify = require('slugify')
const productModel = require('../models/productModel')
const ApiError = require('../utils/errorClass')
const APIFeatures = require('../utils/apiFeatures')
const {deleteDocument} = require('./factoryHandler')

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
    const product = await productModel.create(req.body)
    res.status(201).json({data : product})
    } 



// access : public
const getAllProduct = async (req, res) => {
    
      const features = new APIFeatures(productModel.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['title','description']);
  
      const total = await features.lengthOfData(); // Clone and execute the query to get the total length
      features.paginate();
      const [page, limit] = features.page();
      const products = await features.execute();
  
      res.status(200).json({
        result: products.length,
        page,
        totalPages: Math.ceil(total / limit * 1.0),
        data: products
      });
    
  };
  

  

  // access : public
const getProduct = async (req, res) => {
    const {id} = req.params
    const Product = await productModel.findById(id).populate({path:'category',select : "name -_id"})
    if (! Product) 
        {
            throw new ApiError('Product not found',404)
           
        }
    res.status(200).json(Product)
    
}



// access : private (admin-manager)
const deleteProduct = async (req,res) => {
    const product = await deleteDocument(productModel,'Product' ,req.params.id)
    res.status(200).json(product)
}

// access : private (admin-manager)
const updateProduct = async (req,res) => {
    const {id} = req.params 
    if (req.body.title)
        {
    req.body.slug = slugify(req.body.title)
        }
    const Product = await productModel.findByIdAndUpdate({_id : id},req.body,{new : true})
    if (! Product) 
        {
            throw new ApiError('Product not found',404)
        }
    res.status(200).json(Product)

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