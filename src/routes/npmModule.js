const express = require('express');
const { userAuth } = require('../../middlewares/userAuth');
const User = require('../model/user');
const TechStack = require('../model/npmModule');
const npmModuleRouter = express.Router();


npmModuleRouter.get('/user/npmModules',userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log("user if", user)
        if (!user) return res.status(401).json({status:false, message: "Unauthorized" });
        const npmModules = await User.findById(user._id).select('npmModules -_id');
        console.log("NPM Modules fetched successfully for user:", user._id, npmModules);
        res.status(200).json({
            status:true,
            message:"NPM Modules fetched successfully",
             npmModules: npmModules || [] 
        });
    } catch (error) {
        console.log("Error: while fetching npm modules", error?.message);
        res.status(500).json({
            status:false,
            message: error?.message || "Internal Server Error"
        });
    }
});

npmModuleRouter.patch('/user/npmModules', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { techStack, helperName } = req.body;
        if (!user) return res.status(401).json({status:false, message: "Unauthorized" });
        if (!techStack) return res.status(400).json({status:false, message: "Tech stack is required" });
        let existingNpmModule  =await TechStack.findOne({ techStack: techStack });
        if(!existingNpmModule){
            existingNpmModule = await TechStack.create({ techStack, helperName: helperName || [] });
            await User.findByIdAndUpdate(user._id,
                { $addToSet: { npmModules: existingNpmModule._id } },
                { new: true, runValidators: true });
        }else{
            existingNpmModule = await TechStack.findByIdAndUpdate(existingNpmModule._id,
                { $addToSet: { helperName: { $each: helperName || [] } } },
                { new: true, runValidators: true });
        }
        console.log("npm module added successfully", existingNpmModule);
        res.json({status:true, message: "NPM Module added successfully", data: existingNpmModule });
    } catch (error) {
        console.log("Error: while adding npm module", error?.message);
        res.status(500).json({
            status:false,
            message: error?.message || "Internal Server Error"
        });
    }
})
npmModuleRouter.delete('/user/npmModules/:techStack/:helperName', userAuth, async (req, res) => {

    try {
        const user = req.user;
        const { techStack, helperName } = req.params;
        if (!user) return res.status(401).json({status:false, message: "Unauthorized" });
        if (!techStack) return res.status(400).json({status:false, message: "Tech stack is required" });
        const existingNpmModule  =await TechStack.findOne({ techStack: techStack });
        if (!existingNpmModule) return res.status(404).json({status:false, 
            message: "NPM Module not found" });
        existingNpmModule.helperName = existingNpmModule.helperName.filter(name => name !== helperName);
        await existingNpmModule.save();
        console.log("npm module deleted successfully", existingNpmModule);
        res.json({status:true, message: "NPM Module deleted successfully", data: existingNpmModule });
    } catch (error) {
        console.log("Error: while deleting npm module", error?.message);
        res.status(500).json({
            status:false,
            message: error?.message || "Internal Server Error"
        });
    }
})


module.exports = npmModuleRouter;