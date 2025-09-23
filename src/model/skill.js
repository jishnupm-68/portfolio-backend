const mongoose = require("mongoose");
const validator = require("validator");
const { SKILL_CATEGORIES, PROFICIENCY_LEVELS } = require("../utils/constants");

const skillSchema = new mongoose.Schema({
    skillCategory:{
        type:String,
        required:true,
        trim:true,
        enum:SKILL_CATEGORIES,
        validate(value){
            if(!SKILL_CATEGORIES.includes(value)) throw new Error("Invalid skill category")
        }
    },
    skillName:{
        type:String,
        required:true,
        trim:true,
        minlength:[1, "Skill name must be at least 1 character"],
        maxlength:[100, "Skill name must be at most 100 characters"]
    },
    proficiencyLevel:{
        type:String,
        required:true,
        trim:true,
        enum:PROFICIENCY_LEVELS,
        validate(value){
            if(!PROFICIENCY_LEVELS.includes(value)) throw new Error("Invalid proficiency level")
        }
    }
    },
    {timestamps:true});

const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;