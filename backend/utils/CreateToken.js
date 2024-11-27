// packages
const jwt=require("jsonwebtoken")

const CreateToken=(res,getId)=>{
    const token= jwt.sign({getId},process.env.JWT_SECRET,{expiresIn:"7d"})

    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:24*60*60*1000 //24days
    })
}


module.exports=CreateToken