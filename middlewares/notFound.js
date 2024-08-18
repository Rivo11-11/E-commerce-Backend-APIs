const nfound = (req,res) => {
    res.status(400).send(`Route does not exist : ${req.originalUrl} `)
 }
 
 module.exports = nfound