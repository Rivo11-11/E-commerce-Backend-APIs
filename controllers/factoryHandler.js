const ApiError = require('../utils/errorClass')
const APIFeatures = require('../utils/apiFeatures')

const deleteDocument = async  (Model,name,id) => {
    
    const document = await Model.findByIdAndDelete(id)
    if (! document) 
        {
            throw new ApiError(`${name} not found`,404)
        }
    return document
   
}

const getDocument = async (Model,name,id) => {
    const document = await Model.findById(id)
    if (! document) 
        {
            throw new ApiError(`${name} not found`,404)
        }
    return document

}

const getDocument2 = async (Model,name,key,field) => {
    const document = await Model.findOne({ [key]: field })
    if (! document) 
        {
            throw new ApiError(`${name} ${key} not found`,404)
        }
    return document

}

const updateDocument = async (Model,name,id,body) => {
    const document = await Model.findByIdAndUpdate(id,body,{new : true})
    if (! document) 
        {
            throw new ApiError(`${name} not found`,404)
        }
    return document

}
const createDocument = async (Model,body) => {
    const document = await Model.create(body)
    return document

}

const getAllDocument = async (ModelQuery,query,searchList) => {
    // i return the all object "this" from the api feature class 
    // so i can do the chaining when initializing an instance of the class
    const features = new APIFeatures(ModelQuery, query)
    .filter()
    .sort()
    .limitFields()
    .search(searchList);
    const total = await features.lengthOfData(); // Clone and execute the query to get the total length
    features.paginate();
    const [page, limit] = features.page();
    const documents = await features.execute();

    return [documents,page,limit,total]
}

module.exports = {
    deleteDocument,
    getDocument,
    getDocument2,
    updateDocument,
    createDocument,
    getAllDocument
}