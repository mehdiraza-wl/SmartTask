import jwt from "jsonwebtoken"
import 'dotenv/config'; 

console.log(process.env.JWT_SECRET)


export const generateJWT = async (userId: Number): Promise<String> => {
    const token: String=await jwt.sign({id: userId}, process.env.DB_PASSWORD || 'my_Secret', {
        expiresIn: "7d",
    })
    return token;
}