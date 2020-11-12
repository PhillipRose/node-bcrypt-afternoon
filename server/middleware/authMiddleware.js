
//this is technically a controller file.
//middleware uses the next() to make the following function in the index.js endpoint work. This is a wall that stops users that are not logged in from using the function.
module.exports = {
    usersOnly: (req, res, next) => {
        if(!req.session.user){
          return res.status(401).send(`Please log in`)
        }
        next()
        
    },
    adminsOnly: (res, req, next) =>{
        const { isAdmin } = req.session.user
        if(!isAdmin){
            return res.status(403).send(`Current User is not an admin`)
        }
        next()
    }
}