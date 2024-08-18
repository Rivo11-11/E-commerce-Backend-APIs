
const userModel = require('../models/userModel');
const { deleteDocument, getDocument, updateDocument, createDocument, getAllDocument } = require('./factoryHandler');
const {postImage,resizeImage} = require('../middlewares/uploadImage')


const uploadImage =  postImage('profileImage')

const resizeUploadImage = resizeImage('users','profileImage')


// access : private (admin)
const postUser = async (req, res) => {
    const user = await createDocument(userModel, req.body);
    res.status(201).json({ data: user });
};

// access : private (admin)
const getAllUser = async (req, res) => {
    const searchList = ['name', 'email']
    const [users, page, limit, total] = await getAllDocument(userModel.find(), req.query, searchList);
    res.status(200).json({
        result: users.length,
        page,
        totalPages: Math.ceil(total / limit * 1.0),
        data: users
    });
};

// access : private (admin)
const getUser= async (req, res) => {
    const user = await getDocument(userModel, 'User', req.params.id);
    res.status(200).json(user);
};

// access : private (admin)
const deleteUser = async (req, res) => {
    const user = await deleteDocument(userModel, 'User', req.params.id);
    res.status(200).json(user);
};

// access : private (admin)
// all field exept password
const updateUser = async (req, res) => {
    const user = await updateDocument(userModel, 'User', req.params.id, {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        slug : req.body.slug,
        profileImage : req.body.profileImage,
        role : req.body.role,
        active : req.body.active
    });
    res.status(200).json(user);
};

// access : private (admin)
const updatePassword = async (req,res) => {
    const user= await updateDocument(userModel, 'User', req.params.id, {password : req.body.password,passwordChangedAt : Date.now()})
    res.status(200).json(user);
}

// Middleware
const logged = async (req,res,next) => {
 req.params.id = req.user._id
 console.log(req.user.name)
 next()
}

// access : private (user)
const update = async (req,res) => {
    // those fileds only allowed by the logged user to change them
    const user = await updateDocument(userModel, 'User', req.params.id, {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        profileImage : req.body.profileImage,
    });
    res.status(200).json(user);

}
module.exports = {
    postUser,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    uploadImage,
    resizeUploadImage,
    logged,
    updatePassword,
    update
    
};
