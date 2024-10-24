const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");

const cleanUpBin = () => {
    cron.schedule("* 0 * * *", async () => {
        console.log("running a task everyday in 0 sec");

        try{
          const deletedBlogsDb = await blogSchema.find({isDeleted : true});
  

        
           let deltedBlogsId = [];
          if(deletedBlogsDb.length === 0) return ;

       
          deletedBlogsDb.map(blog => {
          
           console.log((Date.now() - blog.deletionDateTime)/(1000 * 60 * 60 * 24), "day");

            const timeDiff = (Date.now() - blog.deletionDateTime)/(1000 * 60 * 60 * 24);

            if(timeDiff > 30){
                deltedBlogsId.push(blog._id);
            }
           
          })



          if(deltedBlogsId.length === 0) return ;


          // delete the blogs from the database
         const deletedBlog  = await blogSchema.findOneAndDelete({_id : { $in : deltedBlogsId}});
           
          console.log(`Deleted ${deltedBlogsId.length} blog(s) from bin.`);
          console.log(`Blog deleted successfully BlogID : ${deletedBlog._id}`);

        } catch(error){
            console.error(error);
        }
    })
}

module.exports = cleanUpBin;