const mongoose = require("mongoose");
const validator = require("validator");
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        
    },
    email:{
        type:String,
        required:true,
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
 
const User = mongoose.model("User", UserSchema)

module.exports = {User}