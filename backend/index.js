//packages
const express=require("express")
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")

//utils
const connectDB=require("./config/db")

const app=express()
dotenv.config()
const port= process.env.PORT || 5000
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/users",require("./routes/UsersRoute"))


app.listen(port,()=>{
    console.log(`Server listening to port :${port}`)
})