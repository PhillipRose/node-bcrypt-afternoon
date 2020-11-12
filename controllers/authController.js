const bcrypt = require('bcryptjs')

//controller files need a module.exports ={
//     handler functions go here to be imported later when needed}

module.exports = {
    register: async (req, res) =>{
        const { username,password, isAdmin } = req.body,
        db = req.app.get('db'),
        result = await db.get_user([username]),
        existingUser = result[0];
        if (existingUser) {
            return res.status(409).send(`Username is already in use`)
        }
        //genSaltSync should stay at a value of 10 to avoid performance problems
        const salt= bcrypt.genSaltSync(10),
        hash = bcrypt.hashSync(password, salt),
        registeredUser = await db.register_user([isAdmin, username, hash]),
        user = registeredUser[0];
        req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id };
        return res.status(201).send(req.session.user)
    },
    //checks username and password against the db and password with bcrypt.compareSync. Check db folder for context of search command(get_user)
    login: async (res,req) => {
        const { username, password } = req.body,
        foundUser = await req.app.get('db').get_user([username]),
        user = foundUser[0];
        if (!user) {
            return res.status(401).send(`User not found, please register a new account or check username.`)
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if (!isAuthenticated) {
            return res.status(403).send(`Login information is incorrect, please check username and password`)
        }

        req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username }
        return res.send(req.session.user)
        
    },
    logout: (res,req) =>{
        req.session.destroy();
        return res.sendStatus(200)
    }
}