const reviewModel = require('../models/reviewModel')
const {deleteDocument,getDocument,getAllDocument,updateDocument,createDocument} = require('./factoryHandler')


const setFilterObj = (req, res, next) => {
    let filterObj = {} 
    if (req.params.id ) filterObj = {product : req.params.id} 
    req.filterObj = filterObj
    next()
}

const setIdIntoBody = (req, res, next) => {
    if (!req.body.product ) req.body.product = req.params.id
    next()
}
// access : private (user)
const postReview = async (req,res) => {
    req.body.user = req.user._id
    const review = await createDocument(reviewModel,req.body)
    res.status(201).json({data : review})
    } 


 
// access : public
const getAllReviews= async (req,res) => {
  const [reviews,page,limit,total] = await getAllDocument(reviewModel.find(req.filterObj),req.query,[])
  res.status(200).json({result : reviews.length,page,totalPages: Math.ceil(total / limit * 1.0) , data : reviews})
 
}

// access : public
const getReview = async (req, res) => {
    const review = await getDocument(reviewModel,'review',req.params.id)
    res.status(200).json(review)
   
    
}

// access : private (admin-manager-user)
const deleteReview = async (req,res) => {
    const review = await deleteDocument(reviewModel,'review' , req.params.id)
    res.status(200).json(review)
}

// access : private (user)
const updateReview = async (req,res) => {
    const review = await updateDocument(reviewModel,'review',req.params.id,req.body)
    res.status(200).json(review)

}

module.exports = {
    postReview,
    getAllReviews,
    getReview,
    deleteReview,
    updateReview,
    setFilterObj,
    setIdIntoBody

}