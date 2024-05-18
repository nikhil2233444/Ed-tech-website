const {instance}=require('../config/razorpay')
const User=require('../models/User')
const Course=require('../models/Course')
const {mailSender }=require('../utils/mailSender')
const { default: mongoose } = require('mongoose')
//import course enrollement email->it will send a formatted email to you



exports.capturePayment=async(req,res)=>{
    // get course and userId
    const {course_id}=req.body 
    const userId=req.user.id
    //validation
    //validCourseId
   if(!course_id){
    return res.status(404).json({
        success:false,
        message:'not a valid corse id'
    })
   }  
    // validUserDetails
    let course;
    try {
       course=await Course.findById(course_id);
       if(!course){

        return res.status(404).json({
            success:false,
            message:'no course found'
        })
      //user already pay for this course

      const uid= new mongoose.Types.ObjectId(userId)

      if(course.studentsEnrolled.includes(uid)){
        return res.status(404).json({
            success:false,
            message:'student is aready exits!'
        })
      }

       } 
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:error.message
        }) 
    }
   
    // order create 
    const amount=course.price
    const currency="INR"


  const options={
    amount:amount*100,
    currency,
    recieptreceipt: Math.random(Date.now().toString()),
    notes:{
        courseId:course_id,
        userId
    }

  }

  // initiate a payment using rezorPay
  try {
    const paymentResponse=await instance.orders.create(options)
    console.log(paymentResponse);
    res.status(200).json({
        success:true,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        thumbnail:course.thumbnail,
        orderId:paymentResponse.id,
        currency:paymentResponse.currency,
        amount:paymentResponse.amount
    })

  } catch (error) {
     return res.status(404).json({
            success:false,
            message:"could not initiate order!"
        }) 
  }

    // return response
}

//verify signature of razorpay and server->

exports. verifySignature=async(req,res)=>{

  const webhookSecret=123456     // stored at server

  const signature=req.header["x-razorpay-signature"];

 const shasum =crypto.createHmac("shaw256",webhookSecret) 
    // methode which take algo and secret key in input->
    shasum.update(JSON.stringify(req.body))
    const digest=shasum.digest('hex')


    if(digest==shasum){
      console.log("pay is authorized!")

       // now take any action 
    // enrolled student in courese
    // user ke ander student ki object id dalo 
    // course ke ander studnet ki object id dalo
   try {
     const {coureseId,userId}=req.body.payload.payment.entity.course
 
     const enrolledCoures= await Course.findOneAndUpdate({_id:coureseId},{$push:{studentsEnrolled:userId}},{new:true})
     
     console.log(enrolledCoures)
     if(!enrolledCoures){
       return res.status(401).json({
         success:true,
         message:"course not found!"
       })
     }
  
     // find student and add course in it ->
      
     const enrolledStudent =await User.findOneAndUpdate({_id:userId},
       {$push:{courses:coureseId}},{new:true})
 
       console.log(enrolledCoures)

    
       const emailResponse=await mailSender(enrolledStudent.email,
        "contratulation from codehelp",
        "congratulation! you are onboarded into new codehelp courses"
       )
       console.log(emailResponse)

       return res.status(400).json({
        success:true,
        message:"signature verified and course added"
       })

   } catch (error) {
    return res.status(400).json({
      success:true,
      message:error.message
     })

   }

 
}  
else{
  return res.status(401).json({
    success:false,
    message:"invalid request!"
  })
}

    }

   

