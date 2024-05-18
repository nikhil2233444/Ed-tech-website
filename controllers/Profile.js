const Profile=require('../models/Profile')
const User=require('../models/User')
const {uploadImageToCloudinary}=require('../utils/imageUploader')

exports.updateProfile=async(req,res)=>{
    try {
       //get data
       //get userId
       //validation
       //find Profile
       //update Profile
       // return response  

      const {dateOfBirth="",about="",contactNumber,gender}=req.body 

      const id=req.user.id 

      if(!contactNumber||!gender||!id){
        res.status(401).json({
            success:false,
            message:"all fiels are medetory "

        })
      }

     const updatedDetails=await User.findById(id)
     const profileId=updatedDetails.additionalDetails
     const profileDetails=await Profile.findById(profileId)

     profileDetails.dateOfBirth=dateOfBirth
     profileDetails.about=about
     profileDetails.gender=gender
     profileDetails.contactNumber=contactNumber
     await profileDetails.save();


     res.status(200).json({
        success:true,
      message:"profile updated successfully!",
      profileDetails
    })

    } catch (error) {
      return res.status(200).json({
            success:false,
          message:error.message,
          
        })
    }
}

//delete account

exports.deleteAccount=async(req,res)=>{
    try {
        // get id
        const id=req.user.id
        // validation
        const userDetails=await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user not found!"
            })
        }
        //deleteprofile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        //deletUser
        await User.findByIdAndDelete({_id:id})
        // return response

        return res.status(404).json({
            success:true,
            message:"user deleted successfully"
        })

    } catch (error) {
        return res.status(404).json({
            success:false,
            message:"error while deleting the user"
        })
    }
}


// getallUserDetails->
exports.getAllUserDetails=async(req,res)=>{
    try {
        // get id
        const id=req.user.id 
    
        //validation of userdetails
        const userDetails= await User.findById(id).populate("additionDetails").exec();
    
      return res.status(200).json({
        success:true,
        message:"all user fetch successfully",
        userDetails
      })
        
    } catch (error) {
        return res.status(200).json({
            success:false,
            message:"error while getting all user the user",
            
          }) 
    }
}
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};