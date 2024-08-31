
const userModel = require('../models/userModel');
// const ApiError = require('../utils/errorClass')



// Address and WishList can be implemented in the UserController 
// but we divide it into another controller for better handle in the future
// notice that it is Parent child  embedding because the number of addresses and wishlist is relatively small 
// but for the reviews and product relationships it is a child Parent reference because the numbers of reviews for a product is relatively high
const addAddress = async (req,res) => {
const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { address: req.body } },
    { new: true }
);


res.status(201).json({
    status: 'success',
    data: {
        user
    }
});


}

const removeAddress = async (req, res) => {
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { $pull: { address: { _id: req.body.address } } },
            { new: true }
        );
        res.status(200).json({
            status: 'success',
            data: {
                address : user.address
            }
        });
    
};

const getAddress = async (req, res) => {

    const user = await userModel.findById(req.user._id).populate('address');
    res.status(200).json({
        status: 'success',
        result : user.address.length,
        data: {
            address : user.address,
        }
    });


}




module.exports = {
   addAddress,
   removeAddress,
   getAddress
    
};
