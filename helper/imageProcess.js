const fs = require("fs");
const sharp = require("sharp");
const uploadImage = require("./cloudinaryUpload");

const imageProcess = async(image, croppedAreaPixels)=>{
    try {
        const base64data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64data, "base64");
        const data = await sharp(buffer)
        .extract({
            width:Math.floor(croppedAreaPixels.width),
            height:Math.floor(croppedAreaPixels.height),
            left:Math.floor(croppedAreaPixels.x),
            top:Math.floor(croppedAreaPixels.y)
        })
        .png()
        .toBuffer();
        const uploadString = `data:image/png;base64,${data.toString('base64')}`;
        console.log("image processed successfully")
        const uploadResult = await uploadImage(uploadString);
        return uploadResult.secure_url;
    } catch (error) {
        console.log("Error while processing the image: " ,error.message);
    }
}

module.exports = imageProcess;