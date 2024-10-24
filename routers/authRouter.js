const express = require('express');
const authRouter = express.Router();
const isAuth = require('../middlewares/isAuthMiddleware')
const { registerController, loginController, logoutController } = require('../controllers/authController');


authRouter
    .post("/register", registerController)
    .post("/login", loginController) 
    .post("/logout", isAuth, logoutController)



module.exports = authRouter;