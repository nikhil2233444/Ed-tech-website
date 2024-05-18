const Course=require('../models/Course')
const Category=require('../models/Category')
const User=require('../models/User')

const {upleadImageToCloundnary}=require('../utils/imageUploader')


exports.createCourse=async(req,res)=>{
    try {

        // fetch data from body
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body 

        // fetching files
        const thumbnail=req.files.thumbnailImage 

        if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag){
            res.status(400).json({
                success:false,
                message:"all feilds are medetory !"
            })
        }

        // chech for instructor->
         const userId=req.user.id 
         const instructorDetails=await User.findById(userId)
         console.log("instuctor Details !", instructorDetails)

         if(!instructorDetails){
            res.status(400).json({
                success:false,
                message:"instructor not found!"
            })
         }

  // chech given tag is valid or not!
         const tagDetails=await Category.findById(tag)
         if(!tagDetails){
            res.status(400).json({
                success:false,
                message:"tag details not found!"
            })
         }

       // upload image to cloudnary
       const thumbnailImage=await upleadImageToCloundnary(thumbnail,process.env.FOLDER_NAME)  

       const newCourse=await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        whatYouWillLearn:whatYouWillLearn,
        price,
        tag:tagDetails._id,
        thumbnail:thumbnailImage.secure_url

       })

       // add new course in the user schema of instuctor->
       await User.find({_id:instructorDetails._id},{$push:{Course:newCourse._id}},{new:true})
       
       // update the tage schemae // homework
   
       await Tag.findByIdAndUpdate(tag,{$push:{Course:newCourse._id}},{new:true})
      


    res.status(401).json({
        success:true,
        message:"courese is created successfully",
        data:newCourse

    })

    } catch (error) {
     return  res.status(401).json({
            success:false,
            message:"error while creating course",
            error:error
    
        })
    }
}

// get all courses

exports. getAllCourses=async(req,res)=>{

    try {
   
        const allCoures=await Course.find({},{courseName:true,price:true,thumbnail:true,
            instructor:true,ratingAndReviews:true,studentsEnrolled:true
        },{new:true}).populate("instructor").exec();

       res.status(400).json({
        success:true,
        message:"data fetched successfully ",
        data:allCoures
       }) 

        
    } catch (error) {
        
       return res.status(401).json({
        success:true,
        message:"Error while fetching courses "
       }) 
    }
}


// get course details

exports.getCourseDetails=async(req,res)=>{
   try {
     const {courseId}=req.body
 
     const courseDetails=await User.find({_id:courseId}).populate({
         path:"instructor",
         populate:{
             path:"additionlDetails"
         }
     })
     .populate("category")
     .populate("ratingAndreviews")
     .populate({
         path:"courseContent",
         populate: {
             path:"subSection"
         }
     }
 ).exec()
  
 if(!courseDetails){
    return res.status(400).json({
        success:false,
        message:"course Details not found!"
    })
 }
 

 return res.status(200).json({
    success:true,
    message:"course Details find successfully",
    data:courseDetails
 })
 
   } catch (error) {
    
    return res.status(400).json({
        success:false,
        message:error.message,
        data:courseDetails
    })

   }


    
}
