import express from "express"
import { changePassword, updateProfile } from "../controllers/user.controller.js"
import { asyncHandler } from "../utils/asyncWrapper.js"
import passport from "../configs/passport.js"
const router= express.Router()
router.use(passport.authenticate('jwt', { session: false }))

router.patch('/me', asyncHandler(updateProfile))
router.patch('/me/password', asyncHandler(changePassword))



export default router