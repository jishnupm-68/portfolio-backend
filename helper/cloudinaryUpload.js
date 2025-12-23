const cloudinary = require("../config/cloudinary");
const uploadImage = async(filePath)=>{
    try {
        const result = cloudinary.uploader.upload(filePath,
            {
                folder:"portfolio"
            }
        )
        console.log("image successfully uploaded to cloudinary");
        return result;
    } catch (error) {
        console.log("Error in cloudinary upload", error.message);
    }
}

module.exports = uploadImage;