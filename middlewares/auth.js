//auth
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


exports.auth=async(req,res,next)=>{
    try{
        //extract token
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer ", "");

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//isStudent
exports.isStudent=async(req,res,next)=>{

    try {
        if(req.user.accountType!=='Student'){
            res.status(501).json({
                success:false,
                message:"this is protected routes for the students!"
             })
        }
    } catch (error) {
        res.status(501).json({
            success:false,
            message:"user role can be verified please try again!"
         })
    }
}

//isInstructor
exports.isInstructor=async(req,res,next)=>{

    try {
        if(req.user.accountType!=='Instructor'){
            res.status(501).json({
                success:false,
                message:"this is protected routes for the Instuctor!"
             })
        }
    } catch (error) {
        res.status(501).json({
            success:false,
            message:"user role can be verified please try again!"
         })
    }
}

//isAdmin
exports.isAdmin=async(req,res,next)=>{

    try {
        console.log(req.user.accountType)
        if(req.user.accountType!='Admin'){
            console.log(req.user.accountType)
            res.status(501).json({
                success:false,
                message:"this is protected routes for the Admin!"
             })
        }
    } catch (error) {
        res.status(501).json({
            success:false,
            message:"user role can not be verified please try again!"
         })
    }
}
