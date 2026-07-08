import express from "express"
import { changePassword, getProfile, updateProfile } from "../controllers/user.controller.js"
import { asyncHandler } from "../utils/asyncWrapper.js"
import passport from "../configs/passport.js"
const router= express.Router()
router.use(passport.authenticate('jwt', { session: false }))

router.get('/me', getProfile)
router.patch('/me', asyncHandler(updateProfile))
router.patch('/me/password', asyncHandler(changePassword))



export default router