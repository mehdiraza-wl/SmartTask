import  express  from "express";
import { assignTaskDependency, deleteTaskDependency, getTaskDependency} from "../controllers/taskDependency.controller.js";
const router=express.Router({ mergeParams: true });


router.post('/', assignTaskDependency)
router.get('/:taskId/dependency', getTaskDependency)
router.delete('/:taskId/dependency/:dependencyId', deleteTaskDependency)

export default router