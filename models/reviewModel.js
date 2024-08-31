const mongoose = require('mongoose')
const productModel = require('./productModel')

// min max with type Number ------ // minlength -maxlength with type String
const  ReviewSchema = mongoose.Schema(
    {
      title : {
          type : String ,
          minlength : [3,"Too short Review Name Min is 3"],
          maxlength : [200,"Too long Review Name Max is 200"]
      },
      // References 
      user : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required : [true ,"Review must have a user"]
      },
      // that is called a parent-reference happen in the child model ,one product can have many reviews.
      // instead of making a list of reviews as a child reference in the product Model 
      // i reference the product as a filed in the child Model review
      /*
      how to choose between parent reference and child reference : 
      when the child reference is not big .(a small list approxametly) use the child reference 
      like in user and product favourite list . 
      but in here the product can have multiple reviews .... so it's better to do the parent reference in the child model
      smiliar to the embedding and reference subject :
      small data => do embedding 
      huge data  => seperate into another collection and do referecne with mongo id
      */
      product: {
        type : mongoose.Schema.ObjectId,
        ref : "Product" ,
        required : [true ,"Review must have a product"]
      },
      rating : {
        type : Number, 
        min : [1,"Rating must be at least 1"] ,
        max : [5,"Rating must be at most 5"],
        required : [true ,"Reviews must have at rating"]
      } ,

    
    },{
      timestamps : true
    }
  )



  ReviewSchema.statics.calcAverageAndQuantity = async function(productId) {
    const result = await this.aggregate([
      // First stage: filter reviews to have only reviews with the specified productId
      { $match: { product : productId  } },
      // Second stage: group by product and calculate average rating and quantity
      { $group: { _id: '$product', ratingsAverage: { $avg: '$rating' }, ratingsQuantity: { $sum: 1 } } }
    ]);
   
    if  (result.length > 0 )
    {
      // console.log(result);
        await productModel.findByIdAndUpdate(productId, {
        ratingsAverage : result[0].ratingsAverage ,
        ratingsQuantity : result[0].ratingsQuantity
      }
      )
    }
  
  };


ReviewSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'user',
      select: 'name _id'
    });
    next();
  });


// after creating updating deleting a review . a post middleware will be triggered
// to update the changes reviews counts and theirs average in the product id corresponded
ReviewSchema.post('save', async function() {
    await this.constructor.calcAverageAndQuantity(this.product)
  });
  
ReviewSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
      await doc.constructor.calcAverageAndQuantity(doc.product);
    }
  });
  
module.exports = mongoose.model("Review",ReviewSchema)