const { default: mongoose } = require('mongoose');
const Course = require('../models/Course');
const RatingAndRaview = require('../models/RatingAndRaviews');

const User=require('../models/User')


//getcreateRating
exports.createRating=async(req,res)=>{
    try {
       // get user id
       const userId =req.user.id;
       // fetch data from req ki body
       const {rating,review, coureseId}=req.body
       //chech user Id is inrolled or not
       const courseDetails=await Course.findOne({_id:coureseId,studentsEnrolled:{$eleMatch:{$eq:userId}}})

       if(!courseDetails){
        res.status(404).json({
            success:false,
            message:"Student is not enrolled in this course"
        })
       }
       // check user is allready reviews the course or not
       const alreadyReviewed=await RatingAndRaview.findOne({user:userId,course:coureseId})

       if(!alreadyReviewed){
        res.status(404).json({
            success:false,
            message:"course is already review by the user"
        })
       }
       //create rating and review
       const ratingReviews=await RatingAndRaview.create({rating,review,
        course:coureseId,user:userId})

       // update course with this rating and review

        const updatedCoursereview=await Course.findByIdAndUpdate({_id:coureseId},
            {$push:{ratingAndReviews:ratingReviews._id}} ,{new:true})

      
      return res.status(200).json({
        success:true,
        message:"rating and review created successfully",
        updatedCoursereview
      })      
       // return response 
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error while creating rating and reviews",
            
          })  
    }
}



// getAverageRating

exports.getAverageRating=async(req,res)=>{

 try {

    //get course Id
    const {coureseId}=req.body.coureseId
    // calculate average rating
    const result=await RatingAndRaview.aggregate([
        {
            $match:{ 
                course:new mongoose.Types.ObjectId(coureseId)
            }
        },
        {
            _id:null,
            averageRating:{$avg:"$rating"}
        }
    ])
    
    if(result.length>0){
      return  res.status(200).json({
            success:true,
            averageRating:result[0].alreadyReviewed
        })
    }

    return  res.status(200).json({
        success:false,
        message:"no average rating found",
        averageRating:0
    })

    //return rating

    
 } catch (error) {
     return res.status(400).json({
            success:false,
            message:error.message,
            
          })  
 }

}


// getAllRatingAndReviews->


exports.getAllRating=async(req,res)=>{
    try {


      
     const allReviews=await RatingAndRaview.find({})
     .populate({
        path:"user",
        select:"firstName  lastName  email  image"
     })
     .populate({
        paht:'course',
        select:"courseName"
     }).exec()   


    return res.status(200).json({
        message:"get all raing successfully",
        data:allReviews
    })

        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message,
            
          })  
    }
}
