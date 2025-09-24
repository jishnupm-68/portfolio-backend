const express = require("express");
const { userAuth } = require("../../middlewares/userAuth");
const User = require("../model/user");
const Skill = require("../model/skill");
const skillRouter = express.Router();

skillRouter.get("/user/skill",userAuth, async(req,res)=>{
    try {
        const user = req.user;
    if(!user) return res.json({ status:true, message:"Unauthorized"})
    const skill = await User.findById(user._id).populate("skill").select("skill -_id").exec()
    if(!skill) return res.json({status:false, message:"skill is empty"})
    console.log("skills fetched successfully", skill);
    res.json({status:true, message:"Skills fetched successfully", data:skill})
    } catch (error) {
        console.log("error while fetching the skills", error?.message)
        res.json({staus:false, message:error?.message})
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
        console.log("skill added successfully");
        res.json({status:true, message:"Skill added successfully",data:userResult})
    } catch (error) {
        console.log("error while adding the skills", error?.message)
        res.json({staus:false, message:error?.message});
    }
})

skillRouter.delete("/user/skill/:_id",userAuth, async(req,res)=>{
    try {
        const user =req.user;
        if(!user) return res.json({status:false, message:"Unauthorized"})
        const {_id} = req.params;
        const result = await Skill.findByIdAndDelete(_id);
        if(!result) return res.json({status:false, message:"skill Deletion failed"})
        let userResult = await User.findByIdAndUpdate(user._id,
                        {$pull:{skill:result._id}},
                        {new:true}).populate("skill").select("skill -_id")

        if(!userResult) return res.json({status:false, message:"skill Deletion failed"})
        console.log("deletion successful");
        res.json({status:true, message:"Skill deleted", data:userResult})
        
    } catch (error) {
        console.log("error while deleting the skill", error?.message)
        res.json({status:false, message:error?.message})
    }
})
module.exports= skillRouter