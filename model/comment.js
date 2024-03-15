
import mongoose from 'mongoose'
const commentSchema=new mongoose.Schema({
   //name,postId,comments,date
   name:{
    type:String,
    required:true
   },
   postId:{
    type:String,
    required:true
   },
   comments:{
    type:String,
    required:true
   },
   commentedAt:{
    type:Date,
    required:true
   },
  
})

const Comment=mongoose.model("comment",commentSchema)
export default Comment