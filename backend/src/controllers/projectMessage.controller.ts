import type { Request, Response, NextFunction } from 'express';
import ProjectMessage from '../models/ProjectMessages.js';
import User from '../models/User.js';

export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    const {projectId} = req.params

    const messages= await ProjectMessage.findAll({
        where: {
            project_id: projectId
        }
        ,
        include: {
            model: User,
            attributes: ['username'],
            as: "sender"
        },
        order: [["createdAt", "DESC"]]
    })
    
    res.status(200).json({
        success: true,
        messages
    })
}

export const storeMessage = async (req: Request, res: Response, next: NextFunction) => {
    const userId=req.user!.id
    const {projectId} = req.params

    const {content} = req.body

    console.log(userId, projectId, content);
    

    await ProjectMessage.create({
        project_id: Number(projectId),
        sender_id: Number(userId),
        content
    })

    res.status(200).json({
        success: true,
        message: "Message posted successfully"
    })
}