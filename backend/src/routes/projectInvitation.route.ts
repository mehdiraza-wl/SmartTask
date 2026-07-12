import  express  from "express";
import { sendExternalInvitation, sendProjectInvitation } from "../controllers/projectInvitation.controller.js";
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";
const router=express.Router({mergeParams: true});


router.post('/:projectId/invitation', sendProjectInvitation) 
router.post('/external', authorizeProjectRoles(["admin"]), sendExternalInvitation)

export default router