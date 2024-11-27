//packages
const express=require("express")
const router=express.Router()

//utils
const {CreateUser,LogIn,Logout,GetAllUsers,GetProfile,UpdateProfile,DeleteSingleUser,GetSingleUser,UpdateSingleUser}=require("../controllers/UserController")
const {Auth,AuthAdmin}=require("../middleware/AuthMiddleware")

//USER ROUTES
router.post("/register",CreateUser)
router.post("/login",LogIn)
router.post("/logout",Logout)
router.route("/profile").get(Auth,GetProfile).put(Auth,UpdateProfile)


//ADMIN ROUTES
router.get("/",Auth,AuthAdmin,GetAllUsers)
router.route("/:id").delete(Auth,AuthAdmin,DeleteSingleUser).get(Auth,AuthAdmin,GetSingleUser).put(Auth,AuthAdmin,UpdateSingleUser)


module.exports=router