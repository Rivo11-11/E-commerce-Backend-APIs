const mongoose = require('mongoose')



const  CartSchema = mongoose.Schema(
    {
      cartItems :
        [
            {
           product : {
                type: mongoose.Schema.ObjectId,
                ref : "Product",
              },
            color : String ,
            price : Number ,
            quantity : {
              type :Number,
              default : 1
            },

        }
        ],
       totalPrice : {
        type : Number,
        default: 0 
       },

       totalPriceAfterDiscount : Number,
       user: {
                type: mongoose.Schema.ObjectId,
                ref : "User",
              },
    },{
      timestamps : true
    }
  )


module.exports = mongoose.model("Cart",CartSchema)