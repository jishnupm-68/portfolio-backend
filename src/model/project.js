const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const { DEFAULT_PROJECT_IMAGE_URL } = require('../utils/constants');

const projectSchema = new Schema({
    title: {
         type: String,
          required: true,
          trim:true,
          unique: true,
          minlength: 3,
          maxlength: 100
         },
    description: {
         type: String,
          required: true,
          minlength: 10,
          maxlength: 2500
        },
    imageUrl: {
         type: String,
          
          validate(value){
            if(value !== "" && !validator.isURL(value)) throw new Error("Invalid URL format for imageUrl");
             
          },
            default: DEFAULT_PROJECT_IMAGE_URL
        },
    liveProjectUrl: {
         type: String,
          required: true,
          validate(value){
            if(!validator.isURL(value)) throw new Error("Invalid URL format for liveProjectUrl");
          }
        },
    frontEndUrl: {
         type: String,
          required: true,
          validate(value){
            if(!validator.isURL(value)) throw new Error("Invalid URL format for frontEndUrl");
          }
        },
        backEndUrl: {
         type: String,
          required: true,
          validate(value){
            if(!validator.isURL(value)) throw new Error("Invalid URL format for backEndUrl");
          }
        },
    technologies: [{
         type: String
        }],
    category: {
         type: String,
         enum: ["it", "non-it"],
          required: true,
          validate(value){
            if(!["it", "non-it"].includes(value)) throw new Error("Category must be either 'it' or 'non-it'");
          }
        }

}, { timestamps: true });


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;