import jwt from "jsonwebtoken"
import 'dotenv/config'; 

console.log(process.env.JWT_SECRET)


export const generateJWT = async (userId: number, secret: string): Promise<string> => {
    const token: string=await jwt.sign({id: userId}, secret, {
        expiresIn: "7d",
    })
    return token;
}