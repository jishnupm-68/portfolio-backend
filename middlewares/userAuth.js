const jwt = require("jsonwebtoken");
const { User } = require("../src/model/user");

const userAuth = async(req, res)=>{
    try {
        const {token} = req.cookies;
        if(!token) return res.json({status: false, message:"Please login"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {userId} = decoded;
        const user = await User.findById({_id:userId}).select("-password")
        if(!user) throw new Error("Something went wrong, Please login again")
        req.user = user;
        next();

    } catch (error) {
        console.log("Error: ", error?.message);
        res.status(400).json({status:false, message:error?.message});
    }
}

module.exports = {
    userAuth
}