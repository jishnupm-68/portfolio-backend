const express = require("express");
const User = require("../model/user");
const { userAuth } = require("../../middlewares/userAuth");
const Education = require("../model/education");
const educationRouter = express.Router();

educationRouter.get('/user/education', async(req,res)=>{
    try {
        const education = await User.findOne().populate({path:"education", options:{
            sort:{startDate:1}
        }}).select("education -_id")
        res.status(200).json({status:true, message:'education fetched successfully', data:education })
    } catch (error) {
        console.log("error while loading the education", error)
        res.json({status:false, message:error?.message})
    }
})

educationRouter.post('/user/education',userAuth, async(req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.json({status:false , message:"unauthorized"});
        const {institutionName, qualification, startDate, endDate, percentage} = req.body;
        if(!institutionName || !qualification) return res.json({status:false, message:"Required fields are missing"});
        const result = await Education.create({institutionName, qualification, startDate, endDate, percentage})
        if(!result) return res.json({status:false , message:"Unable to insert education"});
        const userEducation = await User.findByIdAndUpdate(user._id,{$addToSet:{education:result._id}},{new:true})
        .populate("education").select("education -_id")
        if(!userEducation) throw new Error("Education saving failed")
        res.status(200).json({status:true, message:'education added successfully', data:userEducation })
    } catch (error) {
        console.log("error while adding the education")
        res.status(500).json({status:false, message:error?.message})
    }
})



educationRouter.patch('/user/education/:_id',userAuth, async(req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.status(401).json({status:false , message:"unauthorized"});
        const {institutionName, qualification, startDate, endDate, percentage} = req.body;
        const {_id} = req.params
        const result = await Education.findByIdAndUpdate({_id},{institutionName, qualification, startDate, endDate, percentage})
        if(!result) throw new Error("Unable to insert education");
        const userEducation = await User.findByIdAndUpdate(user._id,{$addToSet:{education:result._id}},{new:true})
        .populate("education").select("education -_id")
        if(!userEducation) throw new Error("Education saving failed")
        res.status(200).json({status:true, message:'education edited successfully', data:userEducation })
    } catch (error) {
        console.log("error while adding the education", error)
        res.status(500).json({status:false, message:error?.message})
    }
})

educationRouter.delete('/user/education/:_id',userAuth, async(req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.status(401).json({status:false , message:"unauthorized"});
        const {_id} = req.params
        const result = await Education.findByIdAndDelete(_id)
        if(!result) throw new Error("Unable to delete education");
        const userEducation = await User.findByIdAndUpdate(user._id,{$pull:{education:result._id}},{new:true})
        .populate("education").select("education -_id")
        if(!userEducation) throw new Error("Education deleting failed")
        res.status(200).json({status:true, message:'education deleted successfully', data:userEducation })
    } catch (error) {
        console.log("error while adding the education")
        res.status(500).json({status:false, message:error?.message})
    }
})

module.exports = educationRouter