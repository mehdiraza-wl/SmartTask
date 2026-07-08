import jwt from 'jsonwebtoken';

export const generateJWT = (
    userId: number, 
    secret: string, 
    expiry: string
): string => {
    const token: string = jwt.sign({ id: userId }, secret, {
        expiresIn: expiry as any
    })
    return token;
};
