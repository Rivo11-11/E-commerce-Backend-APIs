const brandModel = require('../models/brandModel')
const {deleteDocument,getDocument,getAllDocument,updateDocument,createDocument} = require('./factoryHandler')
const {postImage,resizeImage} = require('../middlewares/uploadImage')


const uploadImage =  postImage('image')

const resizeUploadImage = resizeImage('brands','image')

// access : private (admin-manager)
const postBrand = async (req,res) => {
    const brand = await createDocument(brandModel,req.body)
    res.status(201).json({data : brand})
    } 


 
// access : public
const getAllBrand= async (req,res) => {
  const [brands,page,limit,total] = await getAllDocument(brandModel.find(),req.query,['name' , 'slug'])
  res.status(200).json({result : brands.length,page,totalPages: Math.ceil(total / limit * 1.0) , data : brands})
 
}

// access : public
const getBrand = async (req, res) => {
    const brand = await getDocument(brandModel,'Brand',req.params.id)
    res.status(200).json(brand)
   
    
}

// access : private (admin-manager)
const deleteBrand = async (req,res) => {
    const brand = await deleteDocument(brandModel,'Brand' , req.params.id)
    res.status(200).json(brand)
}

// access : private (admin-manager)
const updateBrand = async (req,res) => {
    const brand = await updateDocument(brandModel,'Brand',req.params.id,req.body)
    res.status(200).json(brand)

}
module.exports = {
    postBrand , 
    getAllBrand, 
    getBrand,
    deleteBrand,
    updateBrand,
    uploadImage,
    resizeUploadImage

}