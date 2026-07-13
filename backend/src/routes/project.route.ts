import  express  from "express";
const router=express.Router();
import passport from "../configs/passport.js"
import { createProject, deleteProject, getAllProjects, getProject, getProjectMembers, updateProjectMember, acceptInvite, updateProject, getExternalProjectView } from "../controllers/project.controller.js";
import { createProjectValidation } from "../middlewares/projectValidation.js";
import validateRequest from "../middlewares/validateResult.js";
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";
import taskRouter from "../routes/task.route.js"
import projectInvitationRouter from "./projectInvitation.route.js"
import projectMessageRouter from "./projectMessage.route.js"
import { validateProjectId } from "../services/validateProjectId.js";

router.use(passport.authenticate('jwt', { session: false }))
router.use('/:projectId', validateProjectId)
router.use('/:projectId/task', taskRouter)
router.use('/:projectId/invitation', projectInvitationRouter)
router.use('/:projectId/messages', projectMessageRouter)

router.get('/', getAllProjects) 
router.get('/:projectId', getProject)
router.post('/', createProjectValidation, validateRequest,createProject) 
router.patch('/:projectId', updateProject) 
router.delete('/:projectId', authorizeProjectRoles(["admin"]), deleteProject) 
router.get('/:projectId/members', getProjectMembers)
router.patch('/:projectId/members/:userId', authorizeProjectRoles(["admin","manager"]), updateProjectMember) 
router.post('/invitation/:token', acceptInvite) 

export default router;