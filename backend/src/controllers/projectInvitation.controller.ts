import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import {ProjectInvitation, ProjectExternalInvitation } from '../models/index.js';
import crypto from 'node:crypto';
import emailQueue from '../queues/email.queue.js';
import { Op } from 'sequelize';

export const sendProjectInvitation = async (req:Request, res:Response, next: NextFunction) => {
    const {projectId}=req.params
    const {invitedEmail, role} = req.body
    const existing = await ProjectInvitation.findOne({
        where: {
            project_id: projectId,
            invitedEmail,
            status: "pending",
            expiry: {
                [Op.gt]: new Date(),
            },
        },
    });
    if (existing) 
        throw new AppError("Invitation already sent.", 409);
    
    const inviteToken=crypto.randomBytes(20).toString("hex")
    const expiry=new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) //7 days expiry
    const projectInvitation=await ProjectInvitation.create({
        project_id: Number(projectId),
        token: inviteToken,
        invitedEmail,
        role,
        expiry
    })
    await emailQueue.add({
        email: invitedEmail,
        subject: "Verification Code",
        message: `You can join the project using link: ${process.env.CLIENT_URL}/project/invite/${inviteToken}`,
    });
    res.status(200).json({
        success: true,
        message: "invitation sent successfully"
    })
}



export const sendExternalInvitation = async (req:Request, res:Response, next: NextFunction) => {
    const {projectId} = req.params
    const inviteToken=crypto.randomBytes(20).toString("hex")
    const expiry=new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) //7 days expiry
    await ProjectExternalInvitation.create({
        token: inviteToken,
        expiry,
        project_id: Number(projectId)
    })

    res.status(201).json({
        success: true,
        token: inviteToken
    })
}
