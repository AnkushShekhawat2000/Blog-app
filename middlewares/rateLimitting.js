const accessSchema = require("../schemas/accessSchema");

const rateLimitting = async (req, res, next) => {
 

    const sessionId = req.session.id;

    // check in db session id exist or not
    try{
        const accessDb = await accessSchema.findOne({sessionId});
         console.log(accessDb);

        if(!accessDb) {
            // this is request one
            const accessObj = new accessSchema({sessionId , lastRequestTime : Date.now()});
            await accessObj.save();

            next();

            return ;
        }


        // R2 - rnth request
        console.log("currentTime :", Date.now(), "lastRequestTime :", accessDb.lastRequestTime);

        const timeDiff = ((Date.now() - accessDb.lastRequestTime) / 1000);

        console.log("timeDiff in sec:", timeDiff);

        if(timeDiff < 2){
            return res.send({
                status: 429,
                message: "Too Many Requests. Please try again after 10 minutes",
            });
        }


        await accessSchema.findOneAndUpdate(
            {sessionId},
            {lastRequestTime : Date.now()},
        
        )
    
        next();

    } catch(error){
        console.log("Error in rate limiting middleware", error);
       
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error: error,
        })

    }





    

}


module.exports = rateLimitting;