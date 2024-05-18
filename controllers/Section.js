const Section=require('../models/Section')
const Course=require('../models/Course')


exports.createSection=async(req,res)=>{
    try {
        // fetch data
        const {sectionName,courseId}=req.body
        //data validation
        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"all fields is require in the section"
            })
        }

        //create section
        const newSection= await Section.create({sectionName})
        //update course with the section object id
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true})

        //H.W-> use populate to replace section/subsection both in updatedCourseDetails

        return res.status(200).json({
            success:true,
            message:'course section created successfully ',
            updatedCourseDetails,
        })
        // return response


    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Error while creating section ',
           
        })
    }
}


exports.updateSection=async(req,res)=>{
    try {
   
        // input data
        // validation
        // section updation
        // return response

        const {sectionName,sectionId}=req.body
      
        if(!sectionName||!sectionId){
            return res.status(400).json({
                success:false,
                message:"all fields is require in the section"
            })
        }

    const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})

        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Error while updating section! ',
           
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try {
        
        // get id -assuming that we sending id in params
        const {sectionId}=req.params 

        await Section.findByIdAndDelete(sectionId)

        // TODO:should we delete this section from course shema

        return res.status(200).json({
            success:true,
            message:"section is deleted successfully"
        })
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'Error while deleting section! ',
           
        })
    }
}