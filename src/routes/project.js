const express= require("express");
const Project = require("../model/project");
const User = require("../model/user");
const { userAuth } = require("../../middlewares/userAuth");
const projectRouter = express.Router();

projectRouter.get("/user/projects",userAuth, async(req,res)=>{
    console.log("inside user projects", req.user);
    try {
        const user = req.user;
        if(!user) return res.json({status:false, message:"User not found"})
        const projects = await User.findById(user._id).populate("projects").select("projects -_id");
        console.log("data fetched successfully", projects);
        res.json({status:true, message:"data fetched", data:projects})  
    } catch (error) {
        console.log("Error: in project fetching ", error?.message);
        res.json({status:false, message:+ error?.message})
    }
})
projectRouter.post("/user/projects",userAuth, async(req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.json({status:false, message:"User not found"})
        const {title, description, imageUrl, liveProjectUrl, frontEndUrl, backEndUrl, technologies, category} = req.body;
        if(!title || !description || !liveProjectUrl || !frontEndUrl || !backEndUrl || !category){
            return res.json({status:false, message:"Required fields are missing"})
        }
        const project = await Project.create({
            title, description, imageUrl, liveProjectUrl, frontEndUrl, backEndUrl, technologies, category
        });
        if(!project) return res.json({status:false, message:"Project creation failed"})
        const updatedUser = await User.findByIdAndUpdate(user._id, {$addToSet:{projects:project._id}},{new:true}).populate("projects").select("projects -_id")
        console.log("Project added to user:", project);
        res.json({status:true, message:"Project created successfully", data:updatedUser})
    } catch (error) {
        console.log("Error: in project adding ", error?.message);
        res.json({status:false, message: error?.message})
        
    }   
})

projectRouter.patch("/user/projects", userAuth,async(req, res)=>{
    try {
        const user =  req.user;
        if(!user) return res.json({status:false, message:"Unauthorized"});
        const {_id,title, description, imageUrl, liveProjectUrl, frontEndUrl, backEndUrl, technologies, category} = req.body;
        const project = await Project.findByIdAndUpdate(_id,
             {title, description, imageUrl, liveProjectUrl, frontEndUrl, backEndUrl, technologies, category},
             {runValidators:true, new:true})
        if(!project) return res.json({status:false, message:"Failed to update project"});
        console.log("project updated successfully", project);
        res.json({status:true, message:"Project updation successful", data:project})

    } catch (error) {
        
        console.log("Error while editing project", error?.message);
        res.json({status:false, message:error?.message});
    }
})


projectRouter.delete("/user/projects/:_id",userAuth, async(req, res)=>{
    try {
        const user = req.user;
        if(!user) return res.json({status:false, message:"Unauthorized"});
        const {_id} = req.params;
        const result = await Project.findByIdAndDelete(_id)
        if(!result) return res.json({status:false, message:"Deletion failed"})
        let userData= await User.findByIdAndUpdate(user._id,{$pull:{projects:result._id}},{new:true}).populate("projects").select("projects -_id")
        console.log("project deleted successfully", result);
        res.json({status:true, message:"project deleted successfully",data:userData})
    } catch (error) {
        console.log("Error while deleting the project", error?.message);
        res.json({status:false, message:error?.message});
    }
})

module.exports = projectRouter;