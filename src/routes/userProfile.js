
const express = require("express");
const User = require("../model/user");
const { userAuth } = require("../../middlewares/userAuth");
const imageProcess = require("../../helper/imageProcess");
const userProfileRouter = express.Router();

userProfileRouter.get("/user/profile", async(req,res)=>{
    try {
        const userProfile = await User.findOne().select("-password -__v -createdAt -updatedAt");
        res.status(200).json({status:true,message:"user profile fetched ", data:userProfile});
    } catch (error) {
        console.log("Error: in user profile fetching ", error);
        res.status(500).json({status:false, message: error?.message})
    }
});

userProfileRouter.patch("/user/profile", userAuth, async(req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.status(401).json({status:false, message:"User not found"});
        const {name, age, gender, description, designation, contactEmail, profileImageUrl, locationPreference, cityPreference, croppedAreaPixels} = req.body;
        const profileImageUploadUrl = await imageProcess(profileImageUrl, croppedAreaPixels);
        const updatedProfile = await User.findByIdAndUpdate(user._id, {
            name, 
            age,
            gender,
            description,
            designation,
            contactEmail,
            profileImageUrl:profileImageUploadUrl,
            locationPreference,
            cityPreference
        },{ runValidators:true,
            new:true,
        });
        if(!updatedProfile) return res.json({status:false, message:"User profile update failed"});
        res.status(200).json({status:true, message:"user profile updated",data:updatedProfile});
    } catch (error) {
        console.log("Error: in user profile updating ", error);
        res.status(500).json({status:false, message: error?.message})
    }
})


module.exports = userProfileRouter;