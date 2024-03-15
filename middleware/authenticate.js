import jwt  from 'jsonwebtoken'
import { User } from '../model/user.js'
const authenticate =async (req,res,next) => {
    console.log("arrived in try block of authenticate ")
    try{
      const token=req.cookies.mycookie
      console.log("token in authenticate ",token)
      if(!token){
        console.log("token is not present ")
        return res.status(401).json({
          success: false,
          message: "missing token"
      })
      }
      console.log("token in cookie is",token);
      try{
        const payload=jwt.verify(token,process.env.TOKEN_SECRET)
        console.log("payload.id",payload.id);
        const rootUser=await User.findOne({_id:payload.id,"tokens.token":token})
        console.log("rootuser is",rootUser)
        if(!rootUser){
          return res.status(401).json({
            success: false,
            message: "user not found",
        })
        }
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        console.log("passed authentication")
        next();
      }catch(e){
        return res.status(401).json({
          success: false,
          message: "token is invalid",
      })
      }
    }
    catch(err){
      console.log("error in authorization",err);
      return res.status(401).json({
        success: false,
        message: "somethings went wrong while verifying token"
    })
    }
}

export {authenticate}
