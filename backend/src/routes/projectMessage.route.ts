import  express  from "express";
import { getMessage, storeMessage } from "../controllers/projectMessage.controller.js";
const router=express.Router({mergeParams: true});

router.get('/', getMessage)
router.post('/', storeMessage)

export default router