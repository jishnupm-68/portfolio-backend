const mongoose = require("mongoose");
const { TECH_STACK } = require("../utils/constants");

const techStackSchema = new mongoose.Schema({
  techStack: {
    type: String,
    required: true,
    unique: true, 
    enum: TECH_STACK,
    trim: true,
    lowercase: true
  },
  helperName: {
    type: [String], 
    default: [],
    trim: true,
    required:true,
    minLength:3
  }
});

const TechStack = mongoose.model("TechStack", techStackSchema);
module.exports = TechStack;
