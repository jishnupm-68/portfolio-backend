const jwt = require("jsonwebtoken");
const  User  = require("../src/model/user");

const userAuth = async(req, res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token) return res.json({status: false, message:"Please login"});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decoded;
        const user = await User.findById(_id).select("-password")
        if(!user) throw new Error("Something went wrong, Please login again")
        req.user = user;
        next();
    } catch (error) {
        console.log("Error: in userauth", error?.message);
        res.status(400).json({status:false, message:error?.message});
    }
}

module.exports = {
    userAuth
}