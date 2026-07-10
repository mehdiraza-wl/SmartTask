import  express  from "express";
import { assignTask, assignTaskDependency, createTask, deleteTaskDependency, getTaskDependency, removeTaskAssignment, updateTask} from "../controllers/task.controller.js";
const router=express.Router({ mergeParams: true });
import commentRouter from './comment.route.js'
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";
router.use('/:taskId/comments',commentRouter)

router.post('/', createTask)
router.patch('/:taskId', updateTask)
router.post('/:taskId/assignment', authorizeProjectRoles(["admin", "manager"]), assignTask)
router.delete('/:taskId/assignment/:userId', authorizeProjectRoles(["admin", "manager"]), removeTaskAssignment)
router.post('/:taskId/dependency', assignTaskDependency)
router.get('/:taskId/dependency', getTaskDependency)
router.delete('/:taskId/dependency/:dependencyId', deleteTaskDependency)

export default router