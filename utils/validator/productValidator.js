const { check } = require('express-validator');
const validation = require('../../middlewares/validationLayer');
const {checkCategory,checkSubcategory,checkDuplicateProduct} = require('./validationDB');

const getProductValidator = [
  check('id').isMongoId().withMessage('Invalid Product ID format'),
  validation(),
];

const createProductValidator = [
  check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters long')
    .custom(checkDuplicateProduct),
  check('description')
    .notEmpty().withMessage('Description is required'),
  check('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric({min : 0}).withMessage('Price must be a number and None Negative')
    .toFloat()
    .custom(value => value.toString().length <= 10).withMessage('Price must be less than 10 digits'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric({ min: 0 }).withMessage('Price After Discount must be a number and None Negative')
    .toFloat()
    .custom((value, { req }) => value < req.body.price).withMessage('Price After Discount must be less than the Price'), 
  check('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isNumeric().withMessage('Quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric().withMessage('Sold must be a number'),  
  check('colors')  
  .optional() 
   .isArray() 
    .withMessage('Colors must be array of strings' ),
   check('images')  
    .optional() 
     .isArray() 
      .withMessage('Images must be array of strings' ),
  check('imageCover')
  .custom((val,{req})=>{
    if (!req.files.imageCover) {
      throw new Error('imageCover is required');
    }
    return true; 
  }),
  check('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid Category ID format')
  // custom take a promise
  .custom(checkCategory),
  check('subcategory')
    .optional().isArray().withMessage('Subcategory must be an array of IDs') 
    .custom(checkSubcategory),
  check('brand')
    .optional().isMongoId().withMessage('Invalid Brand ID format'),
  check('ratingAvg')
    .optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  check('ratingQuantity')
    .optional().isNumeric().withMessage('Rating Quantity must be a number'),
  validation(),
];

const putProductValidator = [
  check('id').isMongoId().withMessage('Invalid Product ID format'),
  validation(),
];

const deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid Product ID format'),
  validation(),
];

module.exports = {
  getProductValidator,
  createProductValidator,
  putProductValidator,
  deleteProductValidator,
};
