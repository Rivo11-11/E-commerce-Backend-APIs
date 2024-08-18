const fs = require('fs');
const path = require('path');
// convert callback based function into promises so u can use your lovely await/async or .then 
const util = require('util');

const unlinkAsync = util.promisify(fs.unlink);



const dbMiddleware = (Model, entity, field) => {
  

  Model.post('init', (doc) => {
    if (doc[field]) {
      doc[field] = `${process.env.BASE_URL}/${entity}/${doc[field]}`;
    }
  });

  Model.post('save', (doc) => {
    if (doc[field]) {
      doc[field] = `${process.env.BASE_URL}/${entity}/${doc[field]}`;
    }
  });

    // Save the document before you delete it
  Model.pre('findOneAndDelete', async function (next) {
        this.docToDelete = await this.model.findOne(this.getQuery());
        next();
      });
  // Post hook to delete the image file after deletion
  Model.post('findOneAndDelete', async function (doc) {
    if (this.docToDelete && this.docToDelete[field]) {
      const imageName = path.basename(this.docToDelete[field]);
      const imagePath = path.join(__dirname,'..', 'uploads', entity, imageName);
      // await does not block the event loop other req and operations can be procedded 
      await unlinkAsync(imagePath);
    }
   
  });
};

module.exports = dbMiddleware;
