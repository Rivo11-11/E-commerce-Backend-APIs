const mongoose = require('mongoose')


// min max with type Number ------ // minlength -maxlength with type String
const  ProductSchema = mongoose.Schema(
    {
      // unique enforce that the title will be not repeated as a second PK rather than the default _id given by Mongo 
      // the advantage : you can not post two record with the same title , i don't care about different _id .. i want to differentiate based on my data 
      title : {
          type : String ,
          required : [true,"Must Insert A Title"] ,
          unique : [true,"Must Insert A Unique Title"],
          minlength : [3,"Too short Product Name Min is 3"],
          maxlength : [200,"Too long Product Name Max is 200"]
      },
      description : {
        type : String ,
        required : [true,"Must Insert A Description"] ,
        
      },
      slug : {
        type : String ,
        lowercase : true
      } ,

      price : {
        type : Number ,
        required : [true,"Must Insert A Price for Product"],
        trim : true ,
        validate: {
          validator: function(value) {
            return value.toString().length <= 10;
          },
          message: "Price must be less than 10 digits"
        }
      },
      priceAfterDiscount : {
        type : Number ,

      },
      quantity : {
        type : Number ,
        required : [true,"Must Insert A Quantity for Product"],
        trim : true ,
      },
      sold : {
        type : Number ,
        default : 0
      },
      colors : [String] ,
      images : [String] ,
      imageCover : String ,
      // References 
      category : {
        type: mongoose.Schema.ObjectId,
        ref : "Category",
        required : [true ,"Product must have a main category"]
      },
      // product can have multiple subcategories under the same main category
      subcategory : [{
        type: mongoose.Schema.ObjectId,
        ref : "SubCategory"
      }] ,
      brand : {
        type : mongoose.Schema.ObjectId,
        ref : "Brand" ,
      },

      ratingsAverage : {
        type : Number, 
        min : [1,"Rating must be at least 1"] ,
        max : [5,"Rating must be at most 5"]
      } ,

      ratingsQuantity : {
        type : Number , 
        default : 0 ,
      }

    },{
      timestamps : true
    }
  )
  // that's called mongoose middleware
  // execute this before any query contain find as a subsequence in this schema 
  // .pre more efficient than post .. since it will populate first and include the result in the find query .
  // advantages => 1) DRY don't need to write populate each time 
  //               2) Consistency all find query will be populated with the same way
  ProductSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'category',
      select: 'name -_id'
    });
    next();
  });
  const setImageUrl = (image) => {
    const imageUrl = `${process.env.BASE_URL}/products/${image}`
    return imageUrl
  }
  ProductSchema.post('init', (doc) => {
    if (doc.imageCover) 
    {
      doc.imageCover = setImageUrl(doc.imageCover)
    }
    if (doc.images)
    {  
      const temp = []
      doc.images.forEach(image =>{
        temp.push(setImageUrl(image))
      })
      doc.images = temp
    }
  });
  ProductSchema.post('save', (doc) => {
    if (doc.imageCover) 
    {
      doc.imageCover = setImageUrl(doc.imageCover)
    }
    if (doc.images)
      {  
        const temp = []
        doc.images.forEach(image =>{
          temp.push(setImageUrl(image))
        })
        doc.images = temp
      }
  });
  
module.exports = mongoose.model("Product",ProductSchema)