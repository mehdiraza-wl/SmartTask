import type { Request, Response, NextFunction } from 'express';
import User from '../models/user.js';
import { AppError } from '../utils/appError.js';
import bcrypt from 'bcryptjs';

export const changePassword = async (req:Request, res:Response, next: NextFunction) => {
    const {oldPassword, newPassword} = req.body
    const userId=req.user!.id
    const user=await User.findOne({
        where: {
            id: userId
        }
    })
    if(!user)
        throw new AppError("User doesn't exist", 404)

    const passwordMatched = await bcrypt.compare(oldPassword, user.hashPassword)
    if(!passwordMatched)
         throw new AppError("Incorrect password", 401);

    const newHashPassword=await bcrypt.hash(newPassword, 10)
    user.hashPassword=newHashPassword
    await user.save()
    res.status(200).json({
        success: true,
        message: "Password changed successfully!"
    })
}


export const updateProfile = async(req: Request, res: Response, next: NextFunction) => {

    const userId = req.user!.id

    const storedUser=await User.update(req.body, {
        where: {
            id: userId,
        },
    });

    res.status(200).json({
        success: true,
        message: "Profile updated successfully"
    })
}

export const getProfile = async(req: Request, res: Response, next: NextFunction) => {
    const userId=req.user!.id
    const queryUser=await User.findByPk(userId,{
        attributes: ['username', 'email', 'isVerified', 'createdAt']
    })
    console.log();
    res.status(200).json({
        success: true,
        data: queryUser?.dataValues
    })
}