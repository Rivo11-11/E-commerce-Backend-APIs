
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const couponModel = require('../models/couponModel');
const ApiError = require('../utils/errorClass');



const calculatePrice = (cart) => {
    let totalPrice = 0
    totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return totalPrice

}




// access: private (admin - manager)
const addItem = async (req, res) => {
    const { productId, color } = req.body;
    const product = await productModel.findById(productId);
    
    // Find the cart of the user if it exists
    const cart = await cartModel.findOne({ user: req.user._id });
    
    // If cart does not exist, create the cart and add the product
    if (!cart) {
        const data = await cartModel.create({
            user: req.user._id,
            cartItems: [
                {
                    product: productId,
                    color,
                    price: product.price,
                }
            ],
            totalPrice : product.price
        });
        res.status(200).json({ data });
    } else {
        // Check if the product already exists in the cart
        const cartItem = cart.cartItems.find(item => item.product.toString() === productId && item.color === color);
        if (cartItem) { 
            const newTotalPrice = cart.totalPrice + product.price; 
            const data = await cartModel.findOneAndUpdate(
                // specifying cart id and also product id inside that cart
                { _id: cart._id, 'cartItems.product': productId, 'cartItems.color': color },
                { $inc: { 'cartItems.$.quantity': 1} ,totalPrice : newTotalPrice},  // Increment quantity for the matched product

                { new: true }
            );
            cart.totalPriceAfterDiscount = undefined
            await cart.save();
            res.status(200).json({ cart });
        } else {
            // Append the new product to the cart if it's different
            const newTotalPrice = cart.totalPrice + product.price;
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price,
            });
            cart.totalPrice = newTotalPrice;
            cart.totalPriceAfterDiscount = undefined
            await cart.save();
            res.status(200).json({ cart });
        }
    }
    

};

const removeItem = async (req, res) => {
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id }, 
        { $pull: { cartItems: { _id: req.params.itemId } } }, 
        { new: true } 
    );

    if (!cart) {
        throw new ApiError(`cart not found`,404)

    }
        const totalPrice = calculatePrice(cart) 
        cart.totalPrice = totalPrice
        cart.totalPriceAfterDiscount = undefined
        await cart.save();
        res.status(200).json({
            status: 'success',
            data: {
                cart
            }
        });
    
};


const getCart = async (req, res) => {
    const cart = await cartModel.findOne({user : req.user._id})
    if (! cart )
    {
        throw new ApiError(`cart not found`,404)

    }
    res.status(200).json({cartLength : cart.cartItems.length,data : cart });

}

const removeCart = async (req, res) => {
    await cartModel.findOneAndDelete({user : req.user._id})
    res.status(204).send('Cart Cleared')

}

const updateQuantityPlus = async (req, res) => {
    const itemId = req.params.itemId;
    const cart = await cartModel.findOneAndUpdate(
        { user : req.user._id, 'cartItems._id': itemId },
        {
            $inc: { 
                'cartItems.$.quantity': 1 
            }
        },  // Increment quantity for the matched product
        { new: true }
    );
    const product = await productModel.findById(cart.cartItems.find(item => item._id.toString() === itemId).product);
    if (cart.cartItems.find(item => item._id.toString() === itemId).quantity > product.quantity) {
        throw new ApiError(`The quantity of order  exceeded the limit : ${product.quantity}`,400)

    }
    const totalPrice = calculatePrice(cart)
    cart.totalPriceAfterDiscount = undefined
    cart.totalPrice = totalPrice
    await cart.save()
    res.status(200).json(cart)

}

const updateQuantityMinus = async (req, res) => {
    const itemId = req.params.itemId;
    const cart = await cartModel.findOneAndUpdate(
        { user : req.user._id, 'cartItems._id': itemId },
        {
            $inc: { 
                'cartItems.$.quantity': -1 
            }
        },  // Decrement quantity for the matched product

        { new: true }
    );
    if (!cart) {
        throw new ApiError(`cart not found`,404)

    }
    if (cart.cartItems.find(item => item._id.toString() === itemId).quantity < 1) {
        throw new ApiError(`The quantity of product ${itemId} can not be less than 1`,400)

    }
    const totalPrice = calculatePrice(cart)
    cart.totalPriceAfterDiscount = undefined
    cart.totalPrice = totalPrice
    await cart.save()
    res.status(200).json(cart)

}

const applyCoupon = async (req, res) => {
    const coupon  = await couponModel.findOne(
        {
            name : req.body.name,
            expire : { $gt : Date.now()}
        })
    if (!coupon) {
            throw new ApiError('coupon not found or expired',404)
    }
    const discount = coupon.discount 
    const cart = await cartModel.findOne({user : req.user._id})
    const newPrice = (cart.totalPrice *  (100-discount) / 100).toFixed(2)
    cart.totalPriceAfterDiscount = newPrice
    await cart.save()
    res.status(200).json(cart)


}
module.exports = {
    addItem,
    getCart,
    removeItem,
    removeCart,
    updateQuantityPlus,
    updateQuantityMinus,
    applyCoupon
    
};
