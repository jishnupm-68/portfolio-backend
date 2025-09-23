const validator = require("validator")
const User = require("../model/user")
const express = require("express");
const bcrypt = require("bcrypt")
const userRouter = express.Router()

userRouter.post("/signup", async(req,res)=>{
    try {
        const {email, password,name} = req.body;
        if(!validator.isEmail(email)) throw new Error("Email is not valid")
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await  User.create({
            email,
            name,
            password:hash
        })
        const token = await user.getJWT();
        res.cookie("token", token);
        console.log("data saved successfully")
        res.json({status:true, message:"data received", data:user})
    } catch (error) {
        console.log("Error: in signup", error?.message);
        res.json({status:false, message:"Error : "+ error?.message})
    }
})
userRouter.post("/login",async(req,res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email:email})  
        if(!user) throw new Error("Invalid credential");
        const isPasswordSame =await user.comparePassword(password);
        if(!isPasswordSame) throw new Error("Invalid Credential");
        const token  =await user.getJWT();
        res.cookie("token", token);
        req.user = user;
        console.log("Login successful");
        res.json({status:true, message:"Login successful"})
    } catch (error) {
        console.log("error: in login ", error?.message);
        res.json({status:false, message:"Login failed"});
    }
})

userRouter.post("/logout",async(req,res)=>{
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
        console.log("logout successful");
        res.json({status:true, message:"Logout successful"})
        
    } catch (error) {
        console.log("error:  in logout", error?.message);
        res.json({status:false, message:error?.message})
    }
})




module.exports = userRouter