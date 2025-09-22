const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const  jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("The email id is not valid")
            if(value!==process.env.ADMIN_EMAIL) throw new Error("You are not allowed to create an account here")
        }
    },
    password:{
        type:String,
        required:true,

    }

})
 UserSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign(
        {_id:user?._id},
        process.env.JWT_SECRET,
        {expiresIn:"3h"}
    )
    return token
 }

 UserSchema.methods.comparePassword = async function(input){
    let user = this;
    let hash = user?.password;
    const result = await bcrypt.compare(input, hash);
    return result
 }


const User = mongoose.model("User", UserSchema)

module.exports = {User}