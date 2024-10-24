const {LIMIT} = require("../privateConstant")
const followSchema = require("../schemas/followSchema");
const userSchema = require("../schemas/userSchema");

const followUser = ({followerUserId, followingUserId}) =>{

   
    return new Promise(async (resolve, reject) => {

        try{    

            // check if already following user
            const followAlreadyDb = await followSchema.findOne({
                followerUserId,
                followingUserId
            });

            if(followAlreadyDb){
                return reject("Already following the user.")
            }

            const followObj = new followSchema({
                followerUserId,
                followingUserId,
                creationDateTime : Date.now(),
            });


   
            const followDb = await followObj.save();
            resolve(followDb);
        } catch (error){
            reject(error);
        }

    })

}   


const getFollowingList = ({followerUserId, SKIP})=> {
    return new Promise(async (resolve, reject) => {

        try{
            const followingListDb = await followSchema.aggregate([
                { $match : {followerUserId: followerUserId}},
                { $sort : {creationDateTime : -1}},
                { $skip : SKIP },
                { $limit : LIMIT}, 
            ]);
                        //  console.log(followingListDb);

            const followingUserIdsList = followingListDb.map((follow) => follow.followingUserId);
                        // console.log(followingUserIdsList);

           const followingUserDetails = await userSchema.find({
            _id: { $in : followingUserIdsList },
           });
                      
            resolve(followingUserDetails.reverse());
        } catch(err){
            reject(err);

        }
    })
}


const unfollowUser = ({followerUserId, followingUserId}) => {
    return new Promise(async (resolve, reject) => {

        try{
            const followDb = await followSchema.findOneAndDelete({
                followerUserId,
                followingUserId,
            });

            resolve(followDb);
        }
        catch (error){
            reject(error);
        }
    })
}





const getFollowerList = ({followingUserId, SKIP})=> {
    return new Promise(async (resolve, reject) => {

        try{
            const followerListDb = await followSchema.aggregate([
                { $match : {followingUserId: followingUserId}},
                { $sort : {creationDateTime : -1}},
                { $skip : SKIP },
                { $limit : LIMIT}, 
            ]);

            const followerUserIdsList = followerListDb.map((follower) => follower.followerUserId);

           const followerUserDetails = await userSchema.find({
            _id: { $in : followerUserIdsList },
           });

            resolve(followerUserDetails.reverse());
        } catch(err){
            reject(err);

        }
    })
}



module.exports = {followUser, getFollowingList, unfollowUser, getFollowerList};



