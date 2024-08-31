
const userModel = require('../models/userModel');
// const ApiError = require('../utils/errorClass')

const addProduct = async (req,res) => {
const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.product } },
    { new: true }
);


res.status(201).json({
    status: 'success',
    data: {
        user
    }
});


}

const removeProduct = async (req, res) => {
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { $pull: { wishlist: req.body.product } },
            { new: true }
        );
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    
};

const getWishList = async (req, res) => {

    const user = await userModel.findById(req.user._id).populate('wishlist');
    res.status(200).json({
        status: 'success',
        result : user.wishlist.length,
        data: {
            wishlist : user.wishlist,
        }
    });


}




module.exports = {
   addProduct,
   removeProduct,
   getWishList
    
};
