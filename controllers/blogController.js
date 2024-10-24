const {createBlog, getAllBlogs, getMyBlogs, getBlogWithId, editBlogWithId, deleteBlogWithId} = require("../models/blogModel");
const blogSchema = require("../schemas/blogSchema");
const blogDataValidation = require("../utils/blogUtils");

const createBlogController =  async (req, res)=> {
    console.log("inside create controller", req.body);
    // console.log(req.session);

    const {title, textBody} = req.body;
    const userId = req.session.user.userId;

    try{
      await blogDataValidation({title, textBody});

    }catch(error){
      
      return res.send({
          status: 400,
          message: "Invalid data",
          error: error,
      })

    }

    try{
      const blogDb = await  createBlog({title, textBody, userId})
      
      return res.send({
            status: 200,
            message: "Blog created successfully",
            data : blogDb,
        })

    } catch (error){
    
      return res.send({
          status: 500,
          message: "Internal server error",
          error: error,
      })

    }



}   

const getBlogsController = async (req, res)=>{

  const SKIP = Number(req.query.skip) || 0
  try{
      const blogsDB = await getAllBlogs({SKIP});

      if(blogsDB.length === 0){
        return res.send({
          status: 204,
          message: "No blogs found",
        })
      }

      return res.send({
          status: 200,
          message: "Read success",
          data : blogsDB,
      })
    } catch (error) {
      return res.send({
          status: 500,
          message: "Internal server error",
          error: error,
      })
    }

}

const getMyBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0
  const userId = req.session.user.userId;

  try{
    const myBlogsDb = await getMyBlogs({SKIP, userId})

    if(myBlogsDb.length === 0){
      return res.send({
        status: 204,
        message: "No blogs found for this user",
      })
    }


    return res.send({
        status: 200,
        message: "Read success",
        data : myBlogsDb,
    })  

  } catch (err) {
    return res.send({
        status: 500,
        message: "Internal server error",
        error: err,
    })
  }

}


const editBlogController = async (req, res) => {


   const {title, textBody, blogId} = req.body; 
   const userId = req.session.user.userId;
  try{
      await blogDataValidation({title, textBody})

  } catch(error){
      return res.send({
          status: 400,
          message: "Invalid data",
          error: error,
      })
  }

  try{
      const blogDb = await getBlogWithId({blogId});
      console.log(blogDb);
      console.log(userId, blogDb.userId);
      
      //we cannot compare object id directly
    // id1.equlas(id2)
    //id1.toString() === id2.toString()

    if(!userId.equals(blogDb.userId)){
      return res.send({
        status: 403,
        message: "You are not authorized to edit this blog",
      })
    }


    const timeDiff = ((Date.now() - blogDb.creationDateTime)/(1000 * 60));
    // console.log(timeDiff);

      if(timeDiff > 30){
        return res.send({
          status: 403,
          message: "You can only edit the blog within 30 minutes",

        })
    }

      const updatedBlogDb = await editBlogWithId({title, textBody, blogId})
      
      return res.send({
        status: 200,
        message: "Blog updated successfully",
        data : updatedBlogDb,
      })

  } catch(error){
      return res.send({
          status: 500,
          message: "Internal server error",
          error: error,
      })
  }

}

const deleteBlogController = async (req, res) => {

  const blogId = req.body.blogId
  const userId = req.session.user.userId;

    try{
      const blogDb = await getBlogWithId({blogId})

      if(!userId.equals(blogDb.userId)){
        return res.send({
          status: 403,
          message: "You are not allow to delete this blog",
        })
      }

      const deletedBlogDb = await deleteBlogWithId({blogId});

      return res.send({
        status: 200,
        message: "Blog deleted successfully",
        data : deletedBlogDb,
      })

  } catch (error){
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    })
  }

}





module.exports = {createBlogController, getBlogsController, getMyBlogsController, editBlogController, deleteBlogController};