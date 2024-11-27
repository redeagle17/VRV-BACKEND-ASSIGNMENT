import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../controllers/auth.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//Secured Routes
router.route("/refresh-token").post(refreshAccessToken)
router.route("/logout").post(verifyJWT, logoutUser)

export default router;