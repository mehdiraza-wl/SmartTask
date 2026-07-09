import jwt from "jsonwebtoken"
import type {Response} from 'express'
import 'dotenv/config';
import { generateJWT } from "./generateJWT.js";
import RefreshToken from "../models/RefreshToken.js";
import bcrypt from "bcryptjs";
import crypto from 'node:crypto';

export const generateRefreshTokenAndSetCookie = async (res: Response,userId: number) => {
    const refreshToken=await generateJWT(userId, process.env.JWT_REFRESH_SECRET || 'my_secret', process.env.JWT_REFRESH_EXPIRY || '7d');
    

    const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

    await RefreshToken.create({
        user_id: userId,
        token_hash: refreshTokenHash
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000 //7 days
    })
    return refreshToken;
}