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
    try{
    if(!localFilePath)return null;
    const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
    fs.unlinkSync(localFilePath)
    return response;
    }catch(e){
        fs.unlinkSync(localFilePath)
       throw e;
    }
}
export {uploadOncloudinary}