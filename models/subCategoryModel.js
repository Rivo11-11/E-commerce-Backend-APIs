const mongoose = require('mongoose')



const  SubCategorySchema = mongoose.Schema(
    {
      name : {
          type : String ,
          required : [true,"Must Insert A Name for Subcategory"] ,
          unique : [true,"Must Insert A Unique Name for SubCategory"],
          min : [3,"Too short SubCategory Name"],
          max : [30,"Too long SubCategory Name"]
      },
      slug : {
        type : String ,
        lowercase : true
      } ,
      // same as foregin key in sql
      category : {
        type : mongoose.Schema.ObjectId ,
        ref : 'Category' ,
        required : [true,"SubCategory must belong to a Category"] ,
      }
    },{
      timestamps : true
    }
  )
SubCategorySchema.pre(/^find/, function(next) {
    this.populate({
      path: 'category',
      select: 'name -_id'
    });
    next();
  });
module.exports = mongoose.model("SubCategory",SubCategorySchema)