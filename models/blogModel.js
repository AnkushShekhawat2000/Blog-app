const {LIMIT} = require("../privateConstant");
const blogSchema = require("../schemas/blogSchema")


const createBlog = ({title, textBody, userId})=> {
    return new Promise(async (resolve, reject)=> {
       const blogObj = new blogSchema({
        title : title,
        textBody : textBody,
        userId : userId,
        creationDateTime : Date.now()
       })

       try{
        const blogDb = await blogObj.save();
        resolve(blogDb);
       }catch(error){
        reject(error);
       }
    })
}


const getAllBlogs = ({SKIP}) => {
    return new Promise(async (resolve, reject) => {
        try{
            // 
          const blogDb =  blogSchema.aggregate([
                { $match : { isDeleted : {$ne : true}}},
                {$sort : {creationDateTime : -1}},  // descending order
                {$skip : SKIP},
                {$limit : LIMIT},  // limit 5 data to get
               
            ])

            console.log(blogDb);

            resolve(blogDb);
        } catch (error){

            reject(error);

        }
     })

}

const getMyBlogs = ({SKIP, userId}) => {
    return new Promise(async (resolve, reject) => {
   
        try{
            const myBlogsDb = await blogSchema.aggregate([
                { $match : {userId: userId, isDeleted : {$ne : true}}},
                { $sort : {creationDateTime: -1}},
                { $skip : SKIP},
                { $limit : LIMIT},  

            ]);

            resolve(myBlogsDb);
        } catch(error){
            reject(error);

        }
    })
}

const getBlogWithId =({blogId}) => {
    return new Promise(async (resolve, reject) => {
        if(!blogId) return reject("Missing blogId");
      
        try{
       
            const blogDb = await blogSchema.findOne({ _id : blogId });
            console.log(blogDb);

            if(!blogDb) return reject(`Blog not found with blogId: ${blogId}`);

            resolve(blogDb);
        }catch(error){
            reject(error);
        }
        
    })
}


const editBlogWithId = ({title, textBody, blogId}) =>{
    return new Promise(async (resolve,reject) =>{
        try{
          const blogDb = await blogSchema.findOneAndUpdate(
                 {_id : blogId},
                 {title, textBody}, 
                 {new : true}
                );

            resolve(blogDb);    

        } catch(error){
            reject(error);

        }
    })
}

const deleteBlogWithId = ({blogId}) => {
    return new Promise( async (resolve, reject) => {
      
       try{
      
    
        const blogDb = await blogSchema.findOneAndUpdate(
            {_id: blogId},
            {isDeleted : true, deletionDateTime : Date.now()}
        );

         resolve(blogDb);
       }  catch(err){
        reject(err);
       }
  
     })
 }



module.exports = {createBlog, getAllBlogs, getMyBlogs, getBlogWithId, editBlogWithId, deleteBlogWithId }
 
































// normal fun bna rahe h agr usme koi logic as h jo promise return kr raha h toh hme bhi us frunvtion se promise return krna h