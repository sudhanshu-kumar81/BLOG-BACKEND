import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_API_SECRET
// })

// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dttwdoeg6', 
  api_key: '921475571647339', 
  api_secret: 'Kk-HW1XndyuojhWFikaZRM5HqXQ' 
});

const uploadOncloudinary=async(localFilePath)=>{
    console.log("entered in cloudinary function");
    console.log("process.env.CLOUDINARY_CLOUD_NAME",process.env.CLOUDINARY_CLOUD_NAME)
    console.log("process.env.CLOUDINARY_CLOUD_NAME",process.env.CLOUDINARY_API_KEY)
    console.log("process.env.CLOUDINARY_CLOUD_NAME",process.env.CLOUDINARY_API_SECRET)
    console.log("localFilepath",localFilePath)
    try{
    if(!localFilePath)return null;
    console.log("try block of cloudinary before uploader");
    const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
    console.log("try block of cloudinary after uploader");
    console.log("file is uploaded url is ",response.url);
    fs.unlinkSync(localFilePath)
    return response;
    }catch(e){
        fs.unlinkSync(localFilePath)
        console.log("error in uploading image on cloudinary",e)
       throw e;
    }
}
export {uploadOncloudinary}