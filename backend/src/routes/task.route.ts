import  express  from "express";
import { assignTask, createTask, removeTaskAssignment} from "../controllers/task.controller.js";
const router=express.Router({ mergeParams: true });
import commentRouter from './comment.route.js'
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";
router.use('/:taskId/comments',commentRouter)

router.post('/', createTask)
router.post('/:taskId/assignment', authorizeProjectRoles(["admin", "manager"]), assignTask)
router.delete('/:taskId/assignment/:userId', authorizeProjectRoles(["admin", "manager"]), removeTaskAssignment)

export default router