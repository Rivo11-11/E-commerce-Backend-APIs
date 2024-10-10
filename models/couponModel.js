const mongoose = require('mongoose')



const  CouponSchema = mongoose.Schema(
    {
      name : {
          type : String ,
          required : [true,"Must Insert A Name"] ,
          unique : true ,
          min : [3,"Too short Coupon Name"],
          max : [30,"Too long Coupon Name"]
      },
      expire : {
        type : Date,
        required : [true,"Must Insert A expire Date"] ,
      } ,
      discount :{
        type : Number,
        required : [true,"Must Insert A Discount"]
      } 
    },{
      timestamps : true
    }
  )


module.exports = mongoose.model("Coupon",CouponSchema)