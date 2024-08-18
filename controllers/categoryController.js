
const categoryModel = require('../models/categoryModel');
const { deleteDocument, getDocument, updateDocument, createDocument, getAllDocument } = require('./factoryHandler');
const {postImage,resizeImage} = require('../middlewares/uploadImage')


const uploadImage =  postImage('image')

const resizeUploadImage = resizeImage('categories','image')


// access: private (admin - manager)
const postCategory = async (req, res) => {
    const category = await createDocument(categoryModel, req.body);
    res.status(201).json({ data: category });
};

// access : public 
const getAllCategory = async (req, res) => {
    const [categories, page, limit, total] = await getAllDocument(categoryModel.find(), req.query, ['name', 'slug']);
    res.status(200).json({
        result: categories.length,
        page,
        totalPages: Math.ceil(total / limit * 1.0),
        data: categories
    });
};

// access public
const getCategory = async (req, res) => {
    const category = await getDocument(categoryModel, 'Category', req.params.id);
    res.status(200).json(category);
};


// access private (admin-manager)
const deleteCategory = async (req, res) => {
    const category = await deleteDocument(categoryModel, 'Category', req.params.id);
    res.status(200).json(category);
};

// access private (admin-manager)
const updateCategory = async (req, res) => {
    const category = await updateDocument(categoryModel, 'Category', req.params.id, req.body);
    res.status(200).json(category);
};

module.exports = {
    postCategory,
    getAllCategory,
    getCategory,
    deleteCategory,
    updateCategory,
    uploadImage,
    resizeUploadImage
    
};
