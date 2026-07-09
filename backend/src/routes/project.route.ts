import  express  from "express";
const router=express.Router();
import passport from "../configs/passport.js"
import { createProject, deleteProject, getAllProjects, getProject, sendExternalInvitation, sendProjectInvitation, sendExternalProjectView, getProjectMembers, updateProjectMember, acceptInvite, updateProject } from "../controllers/project.controller.js";
import { createProjectValidation } from "../middlewares/projectValidation.js";
import validateRequest from "../middlewares/validateResult.js";
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";


router.use(passport.authenticate('jwt', { session: false }))

router.get('/', getAllProjects) 
router.get('/:projectId', getProject)
router.post('/', createProjectValidation, validateRequest,createProject) 
router.patch('/:projectId', updateProject) 
router.delete('/:projectId', authorizeProjectRoles(["admin"]), deleteProject) 
router.get('/:projectId/members', getProjectMembers)
router.patch('/:projectId/members/:userId', authorizeProjectRoles(["admin","manager"]), updateProjectMember) 
router.post('/:projectId/invite', sendProjectInvitation) 
router.post('/invite/:token', acceptInvite) 
router.post('/:id/external-invite', sendExternalInvitation)
router.get('/external-invite/:token', sendExternalProjectView) 

export default router;