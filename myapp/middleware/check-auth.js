const HttpError = require("../models/http-errors");
const jwt =require('jsonwebtoken');

module.exports= (req,res,next)=>{
    if(req.method ==='OPTIONS'){
        return next();
    }
    try{
       
        const token=  req.headers.authorization.split(' ')[1];
        
        if (!token){
        throw new Error('Authentication failed no token matched',403);
        }
        const decodedToken=jwt.verify(token,"supersecret_dont_share");
        req.userData={userId:decodedToken.userId};
        next();
    }catch(err){
        const error= new HttpError('Authentication failed, can not verify the token',401);
        return next(error);
    };
    
    
    
}