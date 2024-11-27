const jwt=require("jsonwebtoken")
const User=require("../models/UserModels")

const Auth=async(req,res,next)=>{
    const token=req.cookies.jwt
    try {
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized-No token"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=await User.findById(decoded.getId).select("-password")
        next()
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).json({success:false,message:error.message})
    }
    
    
}

const AuthAdmin=(req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({success:false,message:"Not authorized as an admin"})
    }

}

module.exports={Auth,AuthAdmin}