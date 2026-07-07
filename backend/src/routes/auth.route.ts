import express from "express";
import { createUser, verifyUser } from "../controllers/auth.controller.js";
const router=express.Router()
import { signupValidation } from '../middlewares/auth/signupValidation.js';
import validateRequest from "../middlewares/validateResult.js";


router.post('/signup', signupValidation, validateRequest, createUser)
router.post('/verify', verifyUser)



export default router