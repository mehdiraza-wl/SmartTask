import express from "express";
import { createUser, logout, verifyUser } from "../controllers/auth.controller.js";
const router=express.Router()
import { signupValidation } from '../middlewares/auth/signupValidation.js';
import validateRequest from "../middlewares/validateResult.js";


router.post('/signup', signupValidation, validateRequest, createUser)
router.post('/verify', verifyUser)
router.post('/logout', logout)


export default router