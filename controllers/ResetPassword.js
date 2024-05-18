
const User=require('../models/User')
const mailsender=require('../utils/mailSender')
const bcrypt=require('bcrypt')
const crypto=require('crypto')

//resetPasswordToken
exports.resetPasswordToken=async(req,res)=>{

    try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailsender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
}

//resetPassword

exports.resetPassword=async(req,res)=>{
    //data fetch
    //validation
    //get user details using token
    // if no entry invalid token
    //token time chech
    // hash password
    //password update

  try {
      const {password,confirmPassword,token}=req.body
  
      if(password!==confirmPassword){
          return res.json({
              success:false,
              message:"password is not matching!"
          })
      }
      const userDetails=await User.findOne({token:token});
  
      if(!userDetails){
          return res.json({
              success:false,
              message:"token is invalid"
          })
      }
      if(userDetails.resetPasswordExpires<Date.now()){
          return res.json({
              success:false,
              message:"token is expired ,please regenerate your token!"
          })
      }
  
  
      const hashPassword=await bcrypt.hash(password,10)
  
  
      await User.findOneAndUpdate({token},{password:hashPassword},{new:true})
  
       res.status(200).json({
          success:true,
          message:"password is updated successfully!"
       })
  } catch (error) {
    res.status(400).json({
        success:false,
        message:" error while updating password!"
     })
  }
}