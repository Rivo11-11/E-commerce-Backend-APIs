const crypto = require('crypto');

// eslint-disable-next-line import/no-extraneous-dependencies
const  jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const { updateDocument, createDocument,getDocument2} = require('./factoryHandler');
const APIerror = require('../utils/errorClass')
const sendEmail = require('../utils/sendEmail')


// access: public
const signUp = async (req, res) => {
    const user = await createDocument(userModel, {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
    
    });
    // choose a payload that refer to a unique user 
    const token = jwt.sign({userId : user.id},process.env.JWT_SECRET,{expiresIn : '90d'})

    res.status(201).json({ data: user ,token});
};


// access : public
const login = async (req, res) => {
    const data = {
        name : req.body.name,
        email : req.body.email,
    }
    const token = jwt.sign({userId :req.body._id},process.env.JWT_SECRET,{expiresIn : '90d'})
    res.status(200).json({ data ,token});
};

// access : public
const updatePassword = async (req,res) => {
    const user= await updateDocument(userModel, 'User', req.params.id, {password : req.body.password,passwordChangedAt : Date.now()})
    res.status(200).json(user);
}


/* 
Forget Reset Password cycle  3 requests : 
1)  /forgotpassword send a code to your email address
2)  /verifycode 
3)  /resetpassword
*/

const forgetpassword = async (req, res) => {

 const user = await getDocument2(userModel, 'User', 'email',req.body.email)
 // generate a reset code .. will be encrypted and saved in the db
 const resetcode =  Math.floor(100000 + Math.random() * 900000).toString();

 // hash and save it in the db with other helpful fields
 const hashedresetcode = crypto.createHash('sha256').update(resetcode).digest('hex');
 user. passwordResetCode = hashedresetcode 
 user.passwordResetExpires = Date.now() + 1000 * 60 * 2 // expire after 120 sec
 user.passwordResetVerified  = false 
 await user.save()

// send an email  
try 
{
sendEmail({
    to: user.email,
    subject: 'Reset Code ',
    text: `Hey ${user.name} ... Here is the reset code expires in 2 min. \n ${resetcode}`,

})
} catch(e) // the error will already be catched no need to use try and catch .. but i used them to help to rollback these fields if an error happen
{
    // if an error happen rollback these values
    user. passwordResetCode =undefined 
    user.passwordResetExpires = undefined
    user.passwordResetVerified  = undefined
    await user.save()
}

res.status(200).json({status : 'Success' , message : 'Sent reset code to email'})
}


const verifyCode = async (req,res) => {
    const hashedresetcode = crypto.createHash('sha256').update(req.body.reset_code).digest('hex');
    const user = await userModel.findOne({
        passwordResetCode : hashedresetcode,  
        passwordResetExpires :{$gt : Date.now()}, // still not expired
    })
    if (!user) {

        throw new APIerror('Invalid Reset Code or Reset Code Expired',403)

    }
    user.passwordResetVerified  = true
    await user.save()
    res.status(200).json({status : 'Success' , message : 'Reset Code is Valid'})
    
}

const resetPassword = async (req,res) => {
    const user= await userModel.findOne({
        email : req.body.email 
    })
    if (!user) {throw new APIerror('No user found',404)} 
    if (!user.passwordResetVerified) {throw new APIerror('reset code not verified',400)}
    user.passwordResetVerified = undefined 
    user.passwordResetExpires  = undefined
    user.passwordResetCode = undefined

    user.password = req.body.password
    user.passwordChangedAt = Date.now()

    await user.save()
    const token = jwt.sign({userId :req.body._id},process.env.JWT_SECRET,{expiresIn : '90d'})
    res.status(200).json({user,token});

}








/*
'Bearer' explanation
we deal here with Bearer token .
anyone who got the token right can access the ressource without prove of possession
but what if someone steal it ? we don't cover that case ... certicates are used in that advanced authorization scheme
public / private key => Prove of Possession schem
*/
const protection = async (req,res,next) => {
    // authentication middleware : who are you ?
    /*
    1) check if token exist 
    2) verify token 
    3) check if user exist 
    4) check if user does not change his password so his token will be invalid // in case of stolen password.....
    */
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) 
        throw new APIerror('Please Login to access that route',401)

    const token = req.headers.authorization.split(' ')[1]  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId
    const user = await userModel.findById(id)   

    if (!user) 
        throw new APIerror('Owner of the token has been removed',401)

    const changePassword = parseInt(user.passwordChangedAt.getTime() /1000,10)
    if (changePassword > decoded.iat)
        throw new APIerror('Your token expired login again with the new password',401)

    req.role = user.role
    req.user = user
    next()
}


// that's called closures in javascript,function that return a function 
// in our case . the parent function take parameter and return a middleware and we took advantage to pass our parameters to the middleware
const allowed = (...roles) => (req,res,next) => {
    // authorization middleware .what are your permissions ?
    if (!roles.includes(req.role)) 
        throw new APIerror('Not allowed to access this route',403)
    next()
}



module.exports = {
    signUp,
    updatePassword,
    login,
    forgetpassword,
    verifyCode,
    resetPassword,
    protection,
    allowed
    
};
