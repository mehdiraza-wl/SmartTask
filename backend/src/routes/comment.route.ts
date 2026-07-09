import  express  from "express";
import { addComment, getComments, updateComment } from "../controllers/comment.controller.js";
const router=express.Router({ mergeParams: true });

router.get('/', getComments)
router.post('/', addComment)
router.patch('/:commentId', updateComment)

export default router