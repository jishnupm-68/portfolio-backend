const express = require("express");
const { connectDb } = require("./config/db");
const userRouter = require("./src/routes/user");
const app = express()
require("dotenv").config()


app.use(express.json())
app.use("/", userRouter)


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




