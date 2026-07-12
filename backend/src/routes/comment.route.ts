import  express  from "express";
import { addComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.js";
import { authorizeProjectRoles } from "../middlewares/authorizeProjectRoles.js";
const router=express.Router({ mergeParams: true });

router.get('/', getComments)
router.post('/', addComment)
router.patch('/:commentId', updateComment)
router.delete('/:commentId', authorizeProjectRoles(["admin"]), deleteComment)

export default router