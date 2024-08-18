const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require("path")

const APIerror = require('../utils/errorClass');


const multerOptions = () => {

    const storage = multer.memoryStorage()
    function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new APIerror('Type of file incorrect, should be an image', 400));
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
return upload
}



const postImage = (fieldname) => multerOptions().single(fieldname)

const postMixImage = (fields) =>  multerOptions().fields(fields)


const ensureDirExists = (entity) => {
    const dir = path.join(__dirname, `../uploads/${entity}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const resizeImage = (entity,fieldname) => async (req, res, next) => {
    if ( !req.file ) { return next()}
    ensureDirExists(entity)
    const filename = `${entity}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality : 90})
    .toFile(path.join(__dirname, `../uploads/${entity}/${filename}`));
    req.body[fieldname] = filename
    next()

}

// const resizeMixImage = (entity) => async (req, res, next) => {
//        if ( !req.files ) { return next()}
//        ensureDirExists(entity)

//        if (req.files.imageCover) 
//        {
//         const filename = `${entity}-${Date.now()}.jpeg`
//         await sharp(req.files.imageCover[0].buffer)
//         .resize(1200,800)
//         .toFormat('jpeg')
//         .jpeg({quality : 90})
//         .toFile(path.join(__dirname, `../uploads/${entity}/${filename}`));
//         req.body.imageCover = filename
//        }
//        if (req.files.images) 
//        {
//         req.body.images  = []
//         await Promise.all(req.files.images.map( async (image) => {
//         const filename = `${entity}-${Date.now()}-${image.originalname}.jpeg`
//         await sharp(image.buffer)
//         .resize(600,600)
//         .toFormat('jpeg')
//         .jpeg({quality : 90})
//         .toFile(path.join(__dirname, `../uploads/${entity}/${filename}`));
//         req.body.images.push(filename)
//         }))
//        }
//        next()

// }
const resizeMixImage = (entity, config) => async (req, res, next) => {
    if (!req.files) return next();
  
    ensureDirExists(entity);
    
    await Promise.all(Object.keys(req.files).map(async (key) => {
      if (config[key]) {
        const { single } = config[key];
        
        if (single) {
          const filename = `${entity}-${Date.now()}.jpeg`;
          await sharp(req.files[key][0].buffer)
            .resize(1200,800 )
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(__dirname, `../uploads/${entity}/${filename}`));
          
          req.body[key] = filename;
        } else {
          req.body[key] = [];
          
          await Promise.all(req.files[key].map(async (file) => {
            const filename = `${entity}-${Date.now()}-${file.originalname}.jpeg`;
            await sharp(file.buffer)
              .resize(600,600)
              .toFormat('jpeg')
              .jpeg({ quality: 90 })
              .toFile(path.join(__dirname, `../uploads/${entity}/${filename}`));
            
            req.body[key].push(filename);
          }));
        }
      }
    }));
    
    next();
  };

  

const setImageUrl = (doc,entity,field) => {
    const imageUrl = `${process.env.BASE_URL}/${entity}/${doc[field]}`
    doc[field]= imageUrl
  }
  const dbMiddleware = (Model,entity,field) => {
  
  Model.post('init', (doc) => {
    if (doc[field]) 
    {
      
      setImageUrl(doc,entity,field)
    }
  });
  Model.post('save', (doc) => {
    if (doc[field]) 
    {
      setImageUrl(doc,entity,field)
    }
  });
}
     
    

module.exports = {
    postImage,
    resizeImage,
    postMixImage,
    resizeMixImage,
    dbMiddleware
}
