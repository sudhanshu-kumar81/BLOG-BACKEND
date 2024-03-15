import mongoose from 'mongoose';
const connectDB =async()=>{
  try{
   const connectInstance=await mongoose.connect(`${process.env.MONGODB_URL}`)
   console.log(`MongoDB connected !! DB Host :`,connectInstance.connection.host)
  }catch(e){
    console.log("error while connecting DB",e);
    process.exit(1);
  }
}
export default connectDB