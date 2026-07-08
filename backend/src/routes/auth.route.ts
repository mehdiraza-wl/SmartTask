import express from "express";
import { createUser, handleRefreshToken, login, logout, resetPassword, updatePassword, verifyUser } from "../controllers/auth.controller.js";
const router=express.Router()
import validateRequest from "../middlewares/validateResult.js";
import { passwordValidation, signupValidation, verifyEmail, verifyLoginCredentials } from "../middlewares/authValidation.js";
import { asyncHandler } from "../utils/asyncWrapper.js";


router.post('/signup', signupValidation, validateRequest, asyncHandler(createUser))
router.post('/verify', verifyEmail, validateRequest, asyncHandler(verifyUser))
router.post('/logout', asyncHandler(logout))
router.post('/reset-password', asyncHandler(resetPassword))
router.post('/reset-password/:token', passwordValidation, asyncHandler(updatePassword))
router.post('/refresh', (handleRefreshToken))
router.post('/login', verifyLoginCredentials, validateRequest, asyncHandler(login))
export default router