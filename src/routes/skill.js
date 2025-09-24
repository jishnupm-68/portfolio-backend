const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const User = require("../model/user");
const Skill = require("../model/skill");
const skillRouter = express.Router();

skillRouter.get("/user/skill", async(req,res)=>{
    try {
    const skill = await User.findOne().populate("skill").select("skill -_id").exec()
    if(!skill) return res.json({status:false, message:"skill is empty"})
    res.status(200).json({status:true, message:"Skills fetched successfully", data:skill})
    } catch (error) {
        console.log("error while fetching the skills", error)
        res.status(500).json({staus:false, message:error?.message})
    }
})

skillRouter.post("/user/skill", userAuth,async(req, res)=>{
    try {
        const user= req.user;
        if(!user) return res.json({ status:true, message:"Unauthorized"})
        const {skillCategory, skillName, proficiencyLevel} =req.body;
        let result = await Skill.findOne({skillCategory, skillName})
        if(result) return res.json({status:false,message:"Skill already exist" })
        if(!skillCategory || !skillName || !proficiencyLevel) return res.json({status:false, message: "Data cannot be empty"});
         result = await Skill.create({skillCategory, skillName, proficiencyLevel})
        if(!result) return res.json({status:false, message:"Skill saving failed"});
        let userResult= await User.findByIdAndUpdate(user._id,
            {$addToSet:{skill:result._id}},
            {new:true}
        ).populate("skill").select("skill -_id");
        res.status(201).json({status:true, message:"Skill added successfully",data:userResult})
    } catch (error) {
        console.log("error while adding the skills", error)
        res.status(500).json({staus:false, message:error?.message});
    }
})

skillRouter.delete("/user/skill/:_id",userAuth, async(req,res)=>{
    try {
        const user =req.user;
        if(!user) return res.status(401).json({status:false, message:"Unauthorized"})
        const {_id} = req.params;
        const result = await Skill.findByIdAndDelete(_id);
        if(!result) return res.json({status:false, message:"skill Deletion failed"})
        let userResult = await User.findByIdAndUpdate(user._id,{$pull:{skill:result._id}},{new:true})
            .populate("skill").select("skill -_id")
        if(!userResult) return res.json({status:false, message:"skill Deletion failed"})
        res.status(200).json({status:true, message:"Skill deleted", data:userResult})
    } catch (error) {
        console.log("error while deleting the skill", error)
        res.status(500).json({status:false, message:error?.message})
    }
})
module.exports= skillRouter