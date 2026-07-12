import express from "express"
import { changePassword, getNotification, getProfile, updateNotification, updateProfile } from "../controllers/user.controller.js"
import { asyncHandler } from "../utils/asyncWrapper.js"
import passport from "../configs/passport.js"
const router= express.Router()
router.use(passport.authenticate('jwt', { session: false }))

router.get('/me', getProfile)
router.patch('/me', asyncHandler(updateProfile))
router.patch('/me/password', asyncHandler(changePassword))
router.get('/notifications', getNotification)
router.patch('/notifications/:notificationId', updateNotification)

export default router