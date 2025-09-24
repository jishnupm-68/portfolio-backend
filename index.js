const express = require("express");
const { connectDb } = require("./config/db");
const userRouter = require("./src/routes/user");
const app = express()
const cookieParser = require("cookie-parser");
const projectRouter = require("./src/routes/project");
const userProfileRouter = require("./src/routes/userProfile");
const npmModuleRouter = require("./src/routes/npmModule");
const skillRouter = require("./src/routes/skill");
const educationRouter = require("./src/routes/education");
require("dotenv").config()

app.use(cookieParser())
app.use(express.json())
app.use("/", userRouter)
app.use("/", projectRouter)
app.use("/", userProfileRouter)
app.use("/", npmModuleRouter)
app.use("/", skillRouter)
app.use("/", educationRouter)


connectDb()
.then(()=>{
    console.log("DB connected successfully")
    app.listen(process.env.PORT,()=>{
    console.log("server is running")
    })
})
.catch((error)=>{
    console.log("something went wrong: ", error)
})




