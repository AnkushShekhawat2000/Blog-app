const User = require("../models/userModel")
const userSchema = require("../schemas/userSchema");
const { userDataValidation } = require("../utils/authUtils");
const bcrypt = require("bcryptjs");


const registerController =  async (req, res)=> {


   console.log(req.body);

   const {name, email, username, password} = req.body;

   try{
      await userDataValidation({name, email, username, password});
   } catch(error){
    console.log(error);
      return res.send({
        status: 400,
        message: "Invalid data",
        error: error,
     });
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));


    const userObj = new User({name, email, username, password:hashedPassword});
    try{

     const userDb =  await userObj.registerUser();


      return res.send({
         status: 201,
         message: "User registered successfully",
         data: userDb,
 
      });
    }
    catch(error){
      return res.send({
         status: 500,
         message: "Internal sever error",
         error: error,
       });
      }
    

   }



const loginController =  async (req, res)=> {


   const {loginId, password} = req.body;

   if(!loginId || !password) {
      return res.send({
        status: 400,
        message: "missing user credentials",
      });
   }

   try{
      const userDb =  await User.findUserWithKey({key: loginId});
      // console.log(userDb);

     const isMatched  = await bcrypt.compare(password,userDb.password);
   //   console.log(isMatched);

     if(!isMatched){
      return res.send({
         status: 400,
         message: "Incorrect password",
       });
      }
     
      console.log(req.session);

      req.session.isAuth = true;
      req.session.user = {
         userId : userDb._id,
         email : userDb.email,
         username : userDb.username,
      };

     

      return res.send({
         status: 200,
         message: "Login successfull",
      })
   } catch(error){
      return res.send({
        status: 500,
        message: "Internal sever error",
        error: error,
      });
   }

 

}



const logoutController = (req, res)=> {
   req.session.destroy((err)=> {

      if(err){
         return res.send({
          status: 400,
          message: "Logout unsuccessful",  
         });
      }


      return res.send({
         status: 200,
         message: "Logout successfull",  
      });
   })
}



module.exports = {registerController, loginController, logoutController};