
const couponModel = require('../models/couponModel');
const { deleteDocument, getDocument, updateDocument, createDocument, getAllDocument } = require('./factoryHandler');





// access: private (admin - manager)
const postCoupon = async (req, res) => {
    const Coupon = await createDocument(couponModel, req.body);
    res.status(201).json({ data: Coupon });
};

// access: private (admin - manager)
const getAllCoupon = async (req, res) => {
    const [coupons, page, limit, total] = await getAllDocument(couponModel.find(), req.query,['name']);
    res.status(200).json({
        result: coupons.length,
        page,
        totalPages: Math.ceil(total / limit * 1.0),
        data: coupons
    });
};

// access: private (admin - manager)
const getCoupon = async (req, res) => {
    const Coupon = await getDocument(couponModel, 'Coupon', req.params.id);
    res.status(200).json(Coupon);
};


// access private (admin-manager)
const deleteCoupon = async (req, res) => {
    const Coupon = await deleteDocument(couponModel, 'Coupon', req.params.id);
    res.status(200).json(Coupon);
};

// access private (admin-manager)
const updateCoupon = async (req, res) => {
    const Coupon = await updateDocument(couponModel, 'Coupon', req.params.id, req.body);
    res.status(200).json(Coupon);
};

module.exports = {
    postCoupon,
    getAllCoupon,
    getCoupon,
    deleteCoupon,
    updateCoupon,
    
};
