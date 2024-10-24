const {followUser, getFollowingList, unfollowUser, getFollowerList} = require("../models/followModel");
const User = require("../models/userModel")


const followUserController = async (req, res) => {

    const followerUserId = req.session.user.userId;
    const followingUserId = req.body.followingUserId;


    console.log(followingUserId, followerUserId)

    try{
        await User.findUserWithKey({key : followerUserId});
        await User.findUserWithKey({key : followingUserId});
    } catch(error) {
       return res.send({
         status : 500,
         message: "Internal server error",
         error: error,
       }) 
    }

    try{
        const followDb = await followUser({followerUserId, followingUserId});

        return res.send({
            status: 200,
            message: "Follow sucessfull",
            data : followDb,
        })
    } catch (error){
       return res.send({
            status: 500,
            message: "Internal server error",
            error: error,
       })
    }

   
}


const getFollowingListController  = async (req, res) => {
    const followerUserId = req.session.user.userId;
    const SKIP = Number(req.query.skip) || 0;

    try{
        const followingListDb = await getFollowingList({followerUserId, SKIP});
        
        if(followingListDb.length === 0){
          return res.send({
            status: 200,
            message: "No following found. No person follow you"
          })
        }


        return res.send({
            status: 200,
            message: "followingList read sucess: I am following these persons",
            data : followingListDb,
        })
    } catch(err){
        return res.send({
            status: 500,
            message: "Internal server error",
            error: err,
        })
    }
  
}



const unfollowUserController = async  (req, res)=> {

    const followerUserId = req.session.user.userId;
    const followingUserId = req.body.followingUserId;

    try{
        const followDb = await unfollowUser({followerUserId, followingUserId});

        return res.send({
            status: 200,
            message: "Unfollow sucessfull",
            data : followDb,
        })
    } catch(error){
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error,
        })
    }

}


const  getFollowerListController = async (req, res)=> {

    const followingUserId = req.session.user.userId;
    const SKIP = Number(req.query.skip) || 0;

    try{
        const followerListDb = await getFollowerList({followingUserId, SKIP});
        
        if(followerListDb.length === 0){
          return res.send({
            status: 200,
            message: "No follower found. You are not follow any person"
          })
        }


        return res.send({
            status: 200,
            message: "follower read sucess: these persons are following me",
            data : followerListDb,
        })
    } catch(err){
        return res.send({
            status: 500,
            message: "Internal server error",
            error: err,
        })
    }

}


module.exports = {followUserController, getFollowingListController, unfollowUserController,  getFollowerListController};







