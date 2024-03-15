
import mongoose from 'mongoose'
const postSchema=new mongoose.Schema({
   title:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
   },
   avatar:{
    type:String,
    required:true
   },
   username:{
    type:String,
    required:true
   },
   categories:{
    type:String,
    required:true
   },
   createdAt:{
    type:Date,
    default:Date.now()
   }
})

const Post=mongoose.model("post",postSchema)
export default Post