import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendMail } from '../configs/mailsend.js';
import { generateJWT } from '../utils/generateJWT.js';


export const createUser= async (req: Request, res: Response) => {
    console.log("Inside create");
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
    const {verificationToken} = req.body;

    const user = await User.findOne ({
        where: {
            verificationToken
        }
    })

    if (!user || user.verificationTokenExpiry < new Date()) {
        return res.status(400).json({
            message: "Verification token has expired.",
        });
    }
    await generateTokenAndSetCookie(res, user.id)
    const accessToken=await generateJWT(user.id)
    res.status(200).json({
        success: true,
        accessToken
    })
}


