import jwt from "jsonwebtoken"
import type {Response} from 'express'
import 'dotenv/config';
import { generateJWT } from "./generateJWT.js";

export const generateTokenAndSetCookie = async (res: Response,userId: Number) => {
    const token=await generateJWT(userId);
    res.cookie("refreshToken", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15*24*60*60*1000 //15 days
    })

    return token;
}