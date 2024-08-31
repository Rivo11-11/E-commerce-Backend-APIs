// core modules 
const path = require('path');


/* eslint-disable camelcase */
// third parites modules
require("dotenv").config() 
require('express-async-errors')
const express = require('express')
const morgan = require('morgan')


// your own modules
const connectDB = require("./db/connection")
const categories = require("./routes/categoryRoute")
const subcategories = require("./routes/subCategoryRoute")
const brands = require("./routes/brandRoute")
const products = require("./routes/productRoute")
const users = require("./routes/userRoute")
const auth = require("./routes/authRoute")
const reviews = require("./routes/reviewRoute")
const favourites = require('./routes/wishlistRoute')
const addresses = require('./routes/addressRoute')
const notFound = require('./middlewares/notFound')
const globalErrorHandler = require('./middlewares/globalError') 




const app = express()

// chains of middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads'))) // uploads file will be served as assets of my server.. you can access the images in it by doing that url localhost:8000/entity/name_of_file_saved_in_the_db

// my routes 
app.use('/api/v1/categories',categories)
app.use('/api/v1/subcategories',subcategories)
app.use('/api/v1/brands',brands)
app.use('/api/v1/products',products)
app.use('/api/v1/users',users)
app.use('/api/v1/auth',auth)
app.use('/api/v1/reviews',reviews)
app.use('/api/v1/favourites',favourites)
app.use('/api/v1/addresses',addresses)
// placed after my routes
app.use(notFound)
app.use(globalErrorHandler)




const port = process.env.PORT || 8000
const Mongo_url = process.env.MONGO_URL
let server = null
async function startProgram()
{
            await connectDB(Mongo_url)
            server = app.listen(port,console.log(`Listening on Port: ${  port }...`))

}
startProgram()

// event listner to catch any error by any promise in our program (outside  express ex : DataBase) without using try catch or then catch with each promise
process.on('unhandledRejection',(error)=>{
    console.error(`Unhandled Rejection : ${error}`)
    // finish pending requests then close the server instead of exiting and there are some pending in the background
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else { 
        process.exit(1);
    }
   
})




