import { sendMail } from "../configs/mailsend.js";
import type User from "../models/user.js";

export const generateOtpAndSendEmail = async (user: User) => {
    const verificationToken=Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const verificationTokenExpiry=new Date(Date.now() + (15 * 60 * 1000)); //15 minutes expiry
    user.verificationToken=verificationToken
    user.verificationTokenExpiry=verificationTokenExpiry
    await user.save()
    await sendMail(user.email, "Verification Code", verificationToken)
}