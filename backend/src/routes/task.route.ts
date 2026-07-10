import  express  from "express";
import { assignTask, createTask, removeTaskAssignment, updateTask} from "../controllers/task.controller.js";
const router=express.Router({ mergeParams: true });
import commentRouter from './comment.route.js'
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";
import taskDependencyRouter from "./taskDependency.route.js"
router.use('/:taskId/comments',commentRouter)
router.use('/:taskId/dependency', taskDependencyRouter)

router.post('/', createTask)
router.patch('/:taskId', updateTask)
router.post('/:taskId/assignment', authorizeProjectRoles(["admin", "manager"]), assignTask)
router.delete('/:taskId/assignment/:userId', authorizeProjectRoles(["admin", "manager"]), removeTaskAssignment)


export default router