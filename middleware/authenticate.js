import jwt  from 'jsonwebtoken'
import { User } from '../model/user.js'
const authenticate =async (req,res,next) => {
    try{
      const token=req.cookies.mycookie
      
      if(!token){
        return res.status(401).json({
          success: false,
          message: "missing token"
      })
      }
      try{
        const payload=jwt.verify(token,process.env.TOKEN_SECRET)
        const rootUser=await User.findOne({_id:payload.id,"tokens.token":token})
        if(!rootUser){
          return res.status(401).json({
            success: false,
            message: "user not found",
        })
        }
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();
      }catch(e){
        return res.status(401).json({
          success: false,
          message: "token is invalid",
      })
      }
    }
    catch(err){
      return res.status(401).json({
        success: false,
        message: "somethings went wrong while verifying token"
    })
    }
}

export {authenticate}
