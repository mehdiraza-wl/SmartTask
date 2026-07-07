import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { generateRefreshTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendMail } from '../configs/mailsend.js';
import { generateJWT } from '../utils/generateJWT.js';
import RefreshToken from '../models/refreshToken.js';
import crypto from 'node:crypto';
import { Op } from 'sequelize';
import jwt from "jsonwebtoken"

export const createUser= async (req: Request, res: Response) => {
    //Will receive 3 things, username, email and password
    const {username, email, password} = req.body;

    //Verify that user don't exist
    const existingUser=await User.findOne({where: {email}})
    if(existingUser){
        res.status(400).json({
                    "success": false,
                    "error": "User already exists"
                })
    }
    const verificationToken=Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const verificationTokenExpiry=new Date(Date.now() + (15 * 60 * 1000)); //15 minutes expiry
    const hashPassword=await bcrypt.hash(password,10)
    const user = await User.create({username,email, hashPassword , verificationToken, verificationTokenExpiry})
    await sendMail(user.email, "Verification Code", verificationToken)
    res.status(201).json({
        success: true,
        message: "Verification code sent",
    })
}


export const verifyUser= async (req:Request, res:Response) => {
    const {email, verificationToken} = req.body;

    const user = await User.findOne ({
        where: {
            email,
            verificationTokenExpiry: {
                [Op.gt]: new Date()
            },
            verificationToken
        }
    })

    if (!user) {
        return res.status(400).json({
            message: "Verification token has expired.",
        });
    }
    if(!user.isVerified){
        user.isVerified = true
        await user.save()
    }
    await generateRefreshTokenAndSetCookie(res, user.id)
    const accessToken=await generateJWT(user.id, process.env.JWT_ACCESS_SECRET || 'my_secret')
    user.verificationTokenExpiry=new Date()  //Token expired
    res.status(200).json({
        success: true,
        accessToken
    })
}

export const logout = async (req:Request, res:Response) => {
    const refreshToken = req.cookies.refreshToken

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
        return res.status(400).json({
            success: false,
            message: "Invalid refresh token"
        })
    }
    storedRefreshToken.isRevoked = true;
    await storedRefreshToken.save()
    res.clearCookie('refreshToken')
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}

export const resetPassword = async (req:Request, res:Response) => {
    const {email} = req.body
    const user= await User.findOne({
        where: {
            email
        }
    })
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        })
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetTokenExpiry= new Date(Date.now() + (15 * 60 * 1000));
    user.resetPasswordToken = resetToken
    user.resetPasswordTokenExpiry=resetTokenExpiry
    await sendMail(user.email,"Reset Password",`You can reset your password using the link: ${process.env.CLIENT_URL}/reset-password/${resetToken}`)
    await user.save()
    res.status(200).json({
        success: true,
        message: "Please check your email."
    })
}

export const updatePassword = async (req:Request, res:Response) => {
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
        return res.status(400).json({
            success: false,
            message: "Invalid or Expired reset token."
        })

    const hashPassword=await bcrypt.hash(password, 10)
    user.hashPassword=hashPassword
    user.resetPasswordTokenExpiry=new Date()
    await user.save()
    await sendMail(user.email, "Password Reset Successfully", "You password has been updated successfully. You can login with your new password.")
    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    })
}


export const handleRefreshToken = async (req:Request, res:Response) => {
    const providedToken = req.cookies.refreshToken
    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(providedToken)
        .digest("hex");
    
    const storedRefreshToken = await RefreshToken.findOne( {
        where: {
            token_hash: refreshTokenHash,
        }
    });
    if(!storedRefreshToken){
        return res.status(400).json({
            success: false,
            message: "Invalid refresh token"
        })
    }



    if(storedRefreshToken.isRevoked){ //IF Token reused
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
    }

    storedRefreshToken.isRevoked = true;
    
    await generateRefreshTokenAndSetCookie(res, storedRefreshToken.user_id)
    const accessToken=await generateJWT(storedRefreshToken.user_id, process.env.JWT_ACCESS_SECRET || 'my_secret')
    res.status(200).json({
        success: true,
        accessToken
    })
}