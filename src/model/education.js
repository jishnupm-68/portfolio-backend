const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const EducationSchema = new Schema({
    institutionName:{
        type:String,
        required:true, 
        trim:true,
        minlength:[3, "Institution name must be at least 3 characters"],
        maxlength:[100, "Institution name must be at most 100 characters"]
    },
    qualification:{
        type:String, 
        required:true,
        trim:true,
        minlength:[2, "Qualification must be at least 2 characters"],
        maxlength:[100, "Qualification must be at most 100 characters"],
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
        validate(value){
            if(this.startDate && value && value < this.startDate) throw new Error("End date cannot be before start date")
        }
    },
    percentage:{
        type:Number,
        min:[0, "Percentage cannot be less than 0"],
        max:[100, "Percentage cannot be more than 100"],
    }
}, {timestamps:true});


const Education = mongoose.model("Education", EducationSchema);
module.exports = Education;