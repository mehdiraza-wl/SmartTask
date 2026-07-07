import express from "express";
import { createUser, handleRefreshToken, login, logout, resetPassword, updatePassword, verifyUser } from "../controllers/auth.controller.js";
const router=express.Router()
import validateRequest from "../middlewares/validateResult.js";
import { passwordValidation, signupValidation, verifyEmail, verifyLoginCredentials } from "../middlewares/authValidation.js";


router.post('/signup', signupValidation, validateRequest, createUser)
router.post('/verify', verifyEmail, validateRequest, verifyUser)
router.post('/logout', logout)
router.post('/reset-password', resetPassword)
router.post('/reset-password/:token', passwordValidation, updatePassword)
router.post('/refresh', handleRefreshToken)
router.post('/login', verifyLoginCredentials, validateRequest, login)
export default router