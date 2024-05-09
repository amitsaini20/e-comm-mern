import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//Protected routes token base
export const requireSignIn = async(req,resp,next)=>{
    try{
        const token = req.header('Authorization');
        if (!token) {
            return resp.status(401).send({
                success: false,
                message: 'Unauthorized Access: Token missing',
            });
        }
        const decode = JWT.verify(token, process.env.JWT_SECRET)
        req.user = decode;
        next()
        // req.user = decode;
    }catch(error){
        console.log(error)
    }
}

//admin access
export const isAdmin = async(req,resp,next)=>{
    try{
        // if (!req.user || !req.user._id) {
        //     return resp.status(401).send({
        //         success: false,
        //         message: 'Unauthorized Access: User information missing',
        //     });
        // }
        const user = await userModel.findOne({_id:req.user._id} )
        if(user.role !== 1){
            return resp.status(404).send({
                success:false,
                message:'UnAuthorized Access'
            });
        }else {
            next()
        }
    }catch(error){
        console.log(error)
        resp.status(401).send({
            success:false,
            message:'Error in admin middleware',
            error,
        })
    }
}