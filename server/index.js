require(`dotenv`).config()
const express = require(`express`),
session = require('express-session'),
massive = require('massive'),
authCtrl = require('../controllers/authController'),
treasureCtrl = require(`../controllers/treasureController`),
auth = require(`../server/middleware/authMiddleware`),
PORT = 4000,
app = express(),
{ CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(express.json())

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db =>{
    app.set('db', db)
    console.log('db connected')
})

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET,
    })
)

//Like an axios.post this app.post is using the register method from authcontroller.js to allow the creation of new users the authCtrl.login is pulling the login method to check usernames and passwords then logging in users that pass.

//These app. are also called endpoints.

//the logout is always an app.get NOT .delete as you are not removing database data.
app.post('/auth/register', authCtrl.register);
app.post(`/auth/login`, authCtrl.login)
app.get(`/auth/logout`, authCtrl.logout)

//these are the endpoints for the functioning of the website

//the auth.usersOnly middleware makes it so that one must be logged in for the getUserTreasure to work. Position matters here, middleware goes in between the endpoint and the function.

app.get(`/api/treasure/dragon`, treasureCtrl.dragonTreasure)
app.get(`/api/treasure/user`, auth.usersOnly, treasureCtrl.getUserTreasure);
app.post(`/api/treasure/user`, auth.usersOnly, treasureCtrl.addUserTreasure);
app.get(`/api/treasure/all`, auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(PORT, ()=>console.log(`Server is up on port ${PORT}`))