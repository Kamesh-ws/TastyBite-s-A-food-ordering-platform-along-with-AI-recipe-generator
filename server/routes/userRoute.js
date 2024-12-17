import express from "express";
import { forgetPassword, getAllUsers, loginUser, myProfile, registerUser, resetPassword, updateProfile, verifyUser } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";


const router = express.Router();

router.post("/signup", registerUser);
router.post("/signup/verify", verifyUser);
router.post("/login", loginUser);
// router.post("/googleLogin", googleLogin); 
router.get("/user/profile", isAuth, myProfile);
router.post("/password/forget", forgetPassword);
router.post("/password/reset/:resetToken", resetPassword);
router.put("/user/updateProfile", isAuth, updateProfile);
router.get("/user/all", getAllUsers);

export default router;