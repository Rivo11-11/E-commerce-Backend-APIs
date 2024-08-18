const mongoose = require('mongoose')



const  CategorySchema = mongoose.Schema(
    {
      name : {
          type : String ,
          required : [true,"Must Insert A Name"] ,
          unique : [true,"Must Insert A Unique Name"],
          min : [3,"Too short Category Name"],
          max : [30,"Too long Category Name"]
      },
      slug : {
        type : String ,
        lowercase : true
      } ,
      image : String
    },{
      timestamps : true
    }
  )
  const setImageUrl = (doc) => {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageUrl
  }
  CategorySchema.post('init', (doc) => {
    if (doc.image) 
    {
      setImageUrl(doc)
    }
  });
  CategorySchema.post('save', (doc) => {
    if (doc.image) 
    {
      setImageUrl(doc)
    }
  });

  // monogoose middleware here is essential for saving the generic handlers (factory) 
  // to not be concerned about the image field saved in diff tables 
  // category -> image .. product --> imageCover ... person --> avatar
module.exports = mongoose.model("Category",CategorySchema)