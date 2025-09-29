const express = require('express');
const { userAuth } = require('../../middlewares/userAuth');
const User = require('../model/user');
const TechStack = require('../model/npmModule');
const npmModuleRouter = express.Router();


npmModuleRouter.get('/user/npmModules', async (req, res) => {
    try {
        const npmModules = await User.findOne().populate("techStack").select('techStack -_id');
        res.status(200).json({
            status:true,
            message:"NPM Modules fetched successfully",
             data: npmModules || [] 
        });
    } catch (error) {
        console.log("Error: while fetching npm modules", error);
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
        if (helperName.length<=0) throw new  Error("helpername is required");
        let existingNpmModule  =await TechStack.findOne({ techStack: techStack });
        if(!existingNpmModule){
            existingNpmModule = await TechStack.create({ techStack, helperName: helperName || [] });
            await User.findByIdAndUpdate(user._id,
                { $addToSet: { techStack: existingNpmModule._id } },
                { new: true, runValidators: true });
        }else{
            existingNpmModule = await TechStack.findByIdAndUpdate(existingNpmModule._id,
                { $addToSet: { helperName: { $each: helperName || [] } } },
                { new: true, runValidators: true });
        }
        const npmModules = await User.findOne().populate("techStack").select('techStack -_id');
        res.status(200).json({status:true, message: "NPM Module added successfully", data: npmModules });
    } catch (error) {
        console.log("Error: while adding npm module", error);
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
        const npmModules = await User.findOne().populate("techStack").select('techStack -_id');
        res.status(200).json({status:true, message: "NPM Module deleted successfully", data: npmModules });
    } catch (error) {
        console.log("Error: while deleting npm module", error);
        res.status(500).json({
            status:false,
            message: error?.message || "Internal Server Error"
        });
    }
})


module.exports = npmModuleRouter;