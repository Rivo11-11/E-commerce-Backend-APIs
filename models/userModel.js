const mongoose = require('mongoose')

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt')

const dbMiddleware = require('../middlewares/mongoose')


const  UserSchema = mongoose.Schema(
    {
      name : {
          type : String ,
          required : [true,"Must Insert A Name"] ,
          minlength : [3,"Too short  Name"],
          maxlength : [30,"Too long  Name"],
          trim : true
      },
      slug : {
        type : String ,
        lowercase : true
      } ,
      profileImage : String ,
      phone : String ,

      email : {
        type : String ,
        required : [true,"email is required"],
        unique : [true,"email is already in use"],
      } ,
      password : {  
        type : String ,
        required : [true,"password is required"],
        minlength : [6,"Password must be at least 6 characters"]

      },
      passwordChangedAt: {
        type: Date,
        default: Date.now,
      },
      passwordResetCode : String,
      passwordResetExpires : Date, 
      passwordResetVerified : Boolean,
      role : {
        type  : String ,
        enum : ["admin","user","manager"],
        default : "user"
      },
      // active property when u delete a user make it false
      active : {
        type : Boolean ,
        default : true

      }

    },{
      timestamps : true
    }
  )

  // bcrypt for post methods ex : sign up route (auth) - create user route (user)
  UserSchema.pre('save', async function(next) {
    // that in case of update .. i don't want to change my password
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)
    next()
         
  });

  // bcrypt for update ex : update password (auth - user)
  UserSchema.pre('findOneAndUpdate', async function(next) {
    if (!this._update.password) return next();
    this._update.password = await bcrypt.hash(this._update.password, 12);
    next();
});

dbMiddleware(UserSchema,'users','profileImage')

// will be saved as table ==> users . make User -> lowercase & plural
module.exports = mongoose.model("User",UserSchema)