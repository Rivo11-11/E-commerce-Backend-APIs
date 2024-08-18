const mongoose = require('mongoose')



const  BrandSchema = mongoose.Schema(
    {
      name : {
          type : String ,
          required : [true,"Must Insert A Name"] ,
          unique : [true,"Must Insert A Unique Name"],
          min : [3,"Too short Brand Name"],
          max : [30,"Too long Brand Name"]
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
// init work with "get" "put (update)" ,, to work with "post" use save event instead of init

const setImageUrl = (doc) => {
  const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`
  doc.image = imageUrl
}

BrandSchema.post('init', (doc) => {
    if (doc.image) 
    {
      setImageUrl(doc)
    }
  });

BrandSchema.post('save', (doc) => {
    if (doc.image) 
    {
       setImageUrl(doc)
    }
  });
module.exports = mongoose.model("Brand",BrandSchema)