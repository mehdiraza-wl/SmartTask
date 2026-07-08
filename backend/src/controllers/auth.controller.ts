import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { generateRefreshTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { generateJWT } from '../utils/generateJWT.js';
import RefreshToken from '../models/refreshToken.js';
import crypto from 'node:crypto';
import { Op } from 'sequelize';
import jwt from "jsonwebtoken"
import { generateOtpAndSendEmail } from '../utils/generateOtpAndSendEmail.js';
import emailQueue from '../queues/email.queue.js';
import { AppError } from '../utils/appError.js';

// For registering users, we will receive username, email and password
export const createUser= async (req: Request, res: Response,next: NextFunction) => {
    const {username, email, password} = req.body;

    const existingUser=await User.findOne({where: {email}})
    if(existingUser){
         throw new AppError("User already exists!!", 400);
    }
    const verificationToken=Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const verificationTokenExpiry=new Date(Date.now() + (15 * 60 * 1000)); //15 minutes expiry
    const hashPassword=await bcrypt.hash(password,10)
    const user = await User.create({username,email, hashPassword , verificationToken, verificationTokenExpiry})
    await emailQueue.add({
        email: user.email,
        subject: "Verification Code",
        message: verificationToken,
});
    res.status(201).json({
        success: true,
        message: "Verification code sent",
    })
}

// This endpoint is handling MFA and email-verification after signup
export const verifyUser= async (req:Request, res:Response, next: NextFunction) => {
    const {email, verificationToken} = req.body;

    const user = await User.findOne ({
        where: {
            email,
            verificationToken,
            verificationTokenExpiry: {
                [Op.gt]: new Date()
            },
        }
    })

    if (!user) {
         throw new AppError("Verification token expired", 400);
    }
    if(!user.isVerified){
        user.isVerified = true
        await user.save()
    }
    await generateRefreshTokenAndSetCookie(res, user.id)
    const accessToken=await generateJWT(user.id, process.env.JWT_ACCESS_SECRET || 'my_secret', process.env.JWT_ACCESS_EXPIRY || '15m')
    user.verificationTokenExpiry=new Date()  //Old token expired
    await user.save()
    res.status(200).json({
        success: true,
        accessToken
    })
}

// Old refresh token expired and clearing cookie for logout
export const logout = async (req:Request, res:Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
         throw new AppError("No refresh token found", 401);
    }
    
    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
    
    const storedRefreshToken = await RefreshToken.findOne( {
        where: {
            token_hash: refreshTokenHash
        }
    });
    if(!storedRefreshToken){
         throw new AppError("Invalid refresh token", 400);
    }
    storedRefreshToken.isRevoked = true;
    await storedRefreshToken.save()
    res.clearCookie('refreshToken')
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}

// Handling forget password and sending a link by which user can reset his password
export const resetPassword = async (req:Request, res:Response, next: NextFunction) => {
    const {email} = req.body
    const user= await User.findOne({
        where: {
            email
        }
    })
    if(!user){
         throw new AppError("User already exists", 400);
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetTokenExpiry= new Date(Date.now() + (15 * 60 * 1000));
    user.resetPasswordToken = resetToken
    user.resetPasswordTokenExpiry=resetTokenExpiry
    await user.save()
    await emailQueue.add({
        email: user.email,
        subject: "Reset Password",
        message: `You can reset your password using the link: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
});
    res.status(200).json({
        success: true,
        message: "Please check your email."
    })
}

// Resetting user password with valid token
export const updatePassword = async (req:Request, res:Response, next: NextFunction) => {
    const {token} = req.params
    const {password} = req.body
    
    const user=await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordTokenExpiry: {
            [Op.gt]: new Date()
    }
        },
    })
    if(!user)
         throw new AppError("Invalid or expired reset token", 400);

    const hashPassword=await bcrypt.hash(password, 10)
    user.hashPassword=hashPassword
    user.resetPasswordTokenExpiry=new Date()  //Old token expired
    await user.save()
    await emailQueue.add({
        email: user.email,
        subject: "Password Reset Successfully",
        message: "You password has been updated successfully. You can login with your new password."
    })
    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    })
}

// Implementing refresh token rotation
export const handleRefreshToken = async (req:Request, res:Response, next: NextFunction) => {
    const providedToken = req.cookies.refreshToken
     if (!providedToken) {
         throw new AppError("No refresh token found", 401);
    }
    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(providedToken)
        .digest("hex");
    
    const storedRefreshToken = await RefreshToken.findOne( {
        where: {
            token_hash: refreshTokenHash,
        }
    });
    if(!storedRefreshToken) 
        throw new AppError("Invalid refresh token", 400);

    if(storedRefreshToken.isRevoked){ //If token reused, invalidating all other refresh tokens
        interface JwtPayload {
            id: string
        }
        const user=jwt.verify(providedToken, process.env.JWT_REFRESH_SECRET || 'my_secret') as JwtPayload
        await RefreshToken.update(
        {
            isRevoked: true
        },
        {
            where: {
            user_id: user.id
            }
        }
        );
        throw new AppError("Refresh token can only be used once", 403);
    }

    storedRefreshToken.isRevoked = true;
    await storedRefreshToken.save()
    await generateRefreshTokenAndSetCookie(res, storedRefreshToken.user_id)
    const accessToken=await generateJWT(storedRefreshToken.user_id, process.env.JWT_ACCESS_SECRET || 'my_secret', process.env.JWT_ACCESS_EXPIRY || '15m')

    res.status(200).json({
        success: true,
        accessToken
    })
}

// User will provide email and password, after verifying credentials, he will receive an OTP on his email for verification
export const login = async (req:Request, res:Response, next: NextFunction) => {
    const {email, password} = req.body
    const existingUser=await User.findOne({where: {email}})
    if(!existingUser)
        throw new AppError("User does not exist", 404);
    
    if(!existingUser.isVerified)
        throw new AppError("User is not verified", 401);
    
    const passwordMatched = await bcrypt.compare(password, existingUser.hashPassword)
    if(!passwordMatched){
         throw new AppError("Incorrect password", 401);
    }
    await generateOtpAndSendEmail(existingUser)
    res.status(200).json({
        success: true,
        message: "Verification code sent."
    })
}