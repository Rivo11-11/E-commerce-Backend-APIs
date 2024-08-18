/* eslint-disable camelcase */


// express recognise a middleware with 4 parameters is a global error handling middleware
const errorHandlerMiddleware = async (err, req, res, next) => {
    let status_code = err.status_code || 500; 
    if (err.name.startsWith('JsonWebToken') ||  err.name.startsWith('TokenExpired'))
              status_code = 401
    const status = err.status || 'Error' 
    const operational = err.operational || false
    if (process.env.NODE_ENV === 'development') {
      res.status(status_code).json({ error: err.message,status_code : status_code,status : status  ,operational : operational,stack : err.stack})
  }
  else {
     res.status(status_code).json({ error: err.message , status : status})
  }
}
  
module.exports = errorHandlerMiddleware
  