const validator = require("validator")
const {User} = require("../model/user")
const express = require("express");
const bcrypt = require("bcrypt")
const userRouter = express.Router()

userRouter.post("/signup", async(req,res)=>{
    try {
        const {email, password} = req.body;
        if(!validator.isEmail(email)) throw new Error("Email is not valid")
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = new User({
            email,
            password:hash
        })
        const result = await user.save()
        console.log("data saved successfully")
        res.json({status:true, message:"data received", data:user})
    } catch (error) {
        console.log("Error: ", error?.message);
        res.json({status:false, message:"Error : "+ error?.message})
    }
})




module.exports = userRouter