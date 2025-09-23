const mongoose = require("mongoose");
const validator = require("validator");

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Title must be at least 3 characters"],
        maxlength: [100, "Title must be at most 100 characters"]
    },
    company: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Company name must be at least 3 characters"],
        maxlength: [100, "Company name must be at most 100 characters"]
    },
    location: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Location must be at least 3 characters"],
        maxlength: [100, "Location must be at most 100 characters"]
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate(value){
            if(value < this.startDate) throw new Error("End date cannot be before start date");
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, "Description must be at least 10 characters"],
        maxlength: [1000, "Description must be at most 1000 characters"]
    },
}, {timestamps:true});

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;