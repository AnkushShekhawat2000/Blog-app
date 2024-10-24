const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const session = require('express-session');
const mongodbsession = require('connect-mongodb-session')(session);

// file-imports
const db = require("./db");
const authRouter = require("./routers/authRouter");
const blogRouter = require("./routers/blogRouter");
const followRouter = require("./routers/followRouter");
const isAuth = require('./middlewares/isAuthMiddleware');
const cleanUpBin = require("./cron");
const app = express();
const PORT = process.env.PORT;
const store = new mongodbsession({
    uri : process.env.MONGO_URI,
    collection : 'sessions'
})

//  middlewares
app.use(express.json());

app.use(session({
    secret : process.env.SECRET_KEY,
    store : store,
    resave : false,
    saveUninitialized : false,
}))

app.use('/auth', authRouter)
app.use("/blog",isAuth, blogRouter)
app.use("/follow", isAuth, followRouter)





app.listen(PORT, ()=> {
    console.log(clc.yellowBright(`Server is running at: `));
    console.log(clc.yellowBright.underline.bold(`http://localhost:${PORT}`));
    cleanUpBin();
})

