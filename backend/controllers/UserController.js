//package
const bcrypt = require("bcryptjs");

//utils
const User = require("../models/UserModels");
const CreateToken = require("../utils/CreateToken");

const CreateUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(500)
        .json({ success: false, message: "Please fill all fields" });
    }

    const EmailExist = await User.findOne({ email });
    if (EmailExist) {
      return res
        .status(500)
        .json({ success: false, message: "User already exists" });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    CreateToken(res, newUser._id);

    if (newUser) {
      return res.status(201).json({
        success: true,
        User: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Unable to create User" });
    }
  } catch (error) {
    console.log(`Error:${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

const LogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const CheckEmail = await User.findOne({ email });
    if (!CheckEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    const comparePassword = await bcrypt.compare(password, CheckEmail.password);

    if (!comparePassword) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect password" });
    }

    CreateToken(res, CheckEmail._id);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      User: { ...CheckEmail._doc, password: undefined },
    });
  } catch (error) {
    console.log(`Error:${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

const Logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const GetAllUsers = async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "Not able to fetch any data" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error:${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetProfile = async (req, res) => {
  try {
    res.status(200).json({ success: true, Profile: req.user });
  } catch (error) {
    consoele.log(`Error:${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};


const UpdateProfile=async(req,res)=>{
  try {
    const user=await User.findById(req.user._id)
    if(user){
      user.name=req.body.name || user.name
      user.email=req.body.email || user.email

      if(req.body.password){
        const salt=await bcrypt.genSalt(12)
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
        user.password=hashedPassword
      }

      const updatedProfile=await user.save()
      if(updatedProfile){
        res.status(201).json({success:true,message:"Profile Updated successfully",Profile:updatedProfile})
      }else{
        res.status(500).json({success:false,message:"Unable to update profile"})
      }
    }else{
      return res.status(500).json({success:false,message:"We can't access your profile"})
    }
  } catch (error) {
    console.log(`Error:${error.message}`)
    res.status(500).json({success:false,message:error.message})
  }

}


const DeleteSingleUser=async(req,res)=>{
  try {
    const user=await User.findById(req.params.id)
    if(!user){
      return res.status(500).json({success:false,message:"User can't be found"})
    }
    if(user.isAdmin){
      return res.status(404).json({success:false,message:"Not authorized to delete an admin"})
    }

    const deletedUser=await User.deleteOne({_id:user._id})
    if(deletedUser){
      res.status(200).json({success:true,message:"User deleted successfully"})
    }else{
      res.status(500).json({success:false,message:"Unable to delete user"})
    }
  } catch (error) {
    console.log(`Error:${error.message}`)
    res.status(500).json({success:false,message:error.message})
  }
}


const GetSingleUser=async(req,res)=>{
  try {
    const user=await User.findById(req.params.id).select("-password")
    if(!user){
      return res.status(500).json({success:false,message:"User not found"})
    }
    res.status(200).json({success:true,message:user})
  } catch (error) {
    console.log(`Error:${error.message}`)
    res.status(500).json({success:false,message:error.message})
  }
}


//MAKING A USER AN ADMIN
const UpdateSingleUser=async(req,res)=>{
  try {
    const user=await User.findById(req.params.id)
    if(!user){
      return res.status(500).json({success:false,message:"User can't be found"})
    }
    user.name=req.body.name || user.name
    user.email=req.body.email || user.email
    user.isAdmin=Boolean(req.user.isAdmin)//making the updated user an admin

    const updatedUser=await user.save()
    if(!updatedUser){
      return res.status(500).json({success:false,message:"Unable to update user"})
    }
    res.status(201).json({success:true,message:"Updated successfully"})
  } catch (error) {
    console.log(`Error:${error.message}`)
    res.status(500).json({success:false,message:error.message})
  }
}

module.exports = { CreateUser, LogIn, Logout, GetAllUsers, GetProfile ,UpdateProfile,DeleteSingleUser,GetSingleUser,UpdateSingleUser};
