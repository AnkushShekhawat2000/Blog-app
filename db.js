const mongoose = require('mongoose');
const clc = require('cli-color');


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(clc.yellowBright.bold("mongodb connected successfully")))
    .catch((err) => console.error(clc.redBright("Failed to connect to MongoDB:", err.message)));




    