
const express = require("express");
const User = require("../model/user");
const { userAuth } = require("../../middlewares/userAuth");
const userProfileRouter = express.Router();

userProfileRouter.get("/user/profile",userAuth, async(req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.json({status:false, message:"User not found"});
        const userProfile = await User.findById(user._id).select("-password -__v -createdAt -updatedAt");
        console.log("User profile fetched successfully", userProfile);
        res.json({status:true,message:"user profile fetched ", data:userProfile});
    } catch (error) {
        console.log("Error: in user profile fetching ", error?.message);
        res.json({status:false, message: error?.message})
    }
});

userProfileRouter.patch("/user/profile", userAuth, async(req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.json({status:false, message:"User not found"});
        const {name, age, gender, description, designation, contactEmail, profileImageUrl, locationPreference, cityPreference} = req.body;
        const updatedProfile = await User.findByIdAndUpdate(user._id, {
            name, 
            age,
            gender,
            description,
            designation,
            contactEmail,
            profileImageUrl,
            locationPreference,
            cityPreference
        },{ runValidators:true,
            new:true,
        });
        if(!updatedProfile) return res.json({status:false, message:"User profile update failed"});

        console.log("User profile updated successfully", updatedProfile);
        res.json({status:true, message:"user profile updated",data:updatedProfile});
    } catch (error) {
        console.log("Error: in user profile updating ", error?.message);
        res.json({status:false, message: error?.message})
    }
})






module.exports = userProfileRouter;