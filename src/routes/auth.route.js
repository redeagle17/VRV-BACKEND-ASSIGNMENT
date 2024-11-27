import express, { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../helpers/validator.js";

const router = Router()

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

export default router;