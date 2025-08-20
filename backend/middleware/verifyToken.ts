import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

function verifyToken(tokenString : string){
    if(!secret){
        throw new Error("No jwt secret found");
    }
    const JwtPayload = jwt.verify(tokenString,secret) as JwtPayload;
    if(!JwtPayload){
        return null;
    }
    return JwtPayload;
}
export function verifyUser(req:Request,res:Response,next:NextFunction){
    const cookie = req.headers['cookie'];
    if(!cookie || cookie == ''){
        res.status(401).json({
            'status' : 'error',
            'message' : 'invalid token',
        })
        return;
    }
    
    const tokenString = cookie.split('=')[1]!;
    const userPayload = verifyToken(tokenString);
    if(!userPayload){
        res.status(401).json({
            'status' : 'error',
            'message' : 'invalid token',
        })
        return;
    }
    req.userId = userPayload["userId"];
    req.email = userPayload["email"];

    next();
}