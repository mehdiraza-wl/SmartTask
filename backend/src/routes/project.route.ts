import  express  from "express";
const router=express.Router();
import passport from "../configs/passport.js"
import { createProject, deleteProject, getAllProjects, getProject, sendExternalInvitation, sendProjectInvitation, sendExternalProjectView, getProjectMembers, updateProjectMember, removeProjectMember, updateProject, acceptInvite } from "../controllers/project.controller.js";
import { createProjectValidation } from "../middlewares/projectValidation.js";
import validateRequest from "../middlewares/validateResult.js";
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";


router.use(router.use(passport.authenticate('jwt', { session: false })))

router.get('/', getAllProjects)
router.get('/:id', getProject)
router.patch('/:id', authorizeProjectRoles(["admin"]), updateProject)
router.post('/', createProjectValidation, validateRequest,createProject)
router.delete('/:id', authorizeProjectRoles(["admin"]), deleteProject)
router.get('/:id/members', getProjectMembers)
router.patch('/:id/members/:userId', updateProjectMember)
router.delete('/:id/members/:userId', removeProjectMember)
router.post('/:id/invite', sendProjectInvitation)
router.post('/invite/:token', acceptInvite)
router.post('/:id/external-invite', sendExternalInvitation)
router.get('/external-invite/:token', sendExternalProjectView)

export default router;