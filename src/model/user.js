const mongoose = require("mongoose");
const validator = require("validator");
const {CITY_PREFERENCE, LOCATION_PREFERENCE,GENDER_OPTIONS, DEFAULT_PROFILE_IMAGE_URL} = require("../utils/constants")
const bcrypt = require("bcrypt")
const  jwt = require('jsonwebtoken');
require("../model/skill")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:[3, "Name must be at least 3 characters"],
        maxlength:[50, "Name must be at most 50 characters"]
    },
    age:{
        type:Number,
        min:[18, "Age must be at least 18"],
        max:[100, "Age must be at most 100"],
        default:18,
    },
    gender:{
        type:String,
        enum:GENDER_OPTIONS,
        default:"male",
        validate(value){
            if(!GENDER_OPTIONS.includes(value)) throw new Error("Invalid gender")
        }
    },
    description:{
        type:String,
        trim:true,
        maxlength:[1000, "Description must be at most 1000 characters"]
    },
    designation:{
        type:String,
        trim:true,
        maxlength:[300, "Short designation must be at most 300 characters"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        sparse:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("The email id is not valid")
            if(value!==process.env.ADMIN_EMAIL) throw new Error("You are not allowed to create an account here")
        }
    },
    contactEmail:{
        type:String,
        lowercase:true,
        trim:true,
        validate(value){
            if(value && !validator.isEmail(value)) throw new Error("The contact email id is not valid")
        }
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl: [{
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL format for profileImageUrl");
            }
        },
        default:[DEFAULT_PROFILE_IMAGE_URL]
    }],
    locationPreference:{
        type: [String],
        enum: LOCATION_PREFERENCE,
        validate(value) {
            if (!LOCATION_PREFERENCE.includes(value)) {
                throw new Error("Location preference must be either 'remote', 'hybrid', 'onsite', or 'any'");
            }
        },
        default:["any"],
    },
    cityPreference:{
        type: [String],
        enum: CITY_PREFERENCE,
        validate(value) {
            if (!CITY_PREFERENCE.includes(value)) {
                throw new Error("City preference must be either 'bangalore', 'kerala','calicut',  'kochi', 'chennai', 'trivandrum', or 'any'");
            }
        },
        default:["any"],
    },

    projects: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Project",
        default:[],
    },

    education:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Education",
        default:[],
    },
    skill:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Skill",
        default:[]
    },
    experience:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Experience",
        default:[],
    },
    npmModules:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"NpmModule",
        default:[],

    }
},
{timestamps:true})

 userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign(
        {_id:user?._id},
        process.env.JWT_SECRET,
        {expiresIn:"3h"}
    )
    return token
 }

 userSchema.methods.comparePassword = async function(input){
    let user = this;
    let hash = user?.password;
    const result = await bcrypt.compare(input, hash);
    return result
 }
 

const User = mongoose.model("User", userSchema)

module.exports = User