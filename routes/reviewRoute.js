const express = require("express")
const {getAllReviews,getReview,postReview,updateReview,deleteReview,setFilterObj,setIdIntoBody} = require("../controllers/reviewController")

const {getReviewValidator,createReviewValidator,putReviewValidator,deleteReviewValidator} = require('../utils/validator/reviewValidator')
const {protection,allowed} = require('../controllers/authController')



const router = express.Router({mergeParams: true})

router.route('/').get(setFilterObj,getAllReviews).post(protection,allowed('user'),setIdIntoBody , createReviewValidator,postReview)

router.route('/:id')
.get(getReviewValidator,getReview)
.delete(protection,allowed('admin','manager','user'),deleteReviewValidator,deleteReview)
.put(protection,allowed('user'),putReviewValidator,updateReview)





module.exports = router