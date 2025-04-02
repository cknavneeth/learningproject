import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private configservice:ConfigService){
        cloudinary.config({
            cloud_name: this.configservice.get<string>('CLOUDINARY_CLOUD_NAME'),
            secure: true,
            api_key: this.configservice.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configservice.get<string>('CLOUDINARY_SECRET_KEY')
        });
    }


    async UploadedFile(file:Express.Multer.File):Promise<string>{
        if(!file){
            throw new Error('No file provided')
        }


        if(!file.buffer){
            throw new Error('File buffer is empty')
        }

        const uploadPreset=this.configservice.get<string>('CLOUDINARY_UPLOAD_PRESET')
        const isVideo=file.mimetype.includes('video')

        console.log('Preparing to upload file:', {
            mimetype: file.mimetype,
            size: file.size,
            isVideo,
            uploadPreset
        });

        try{
            const result:UploadApiResponse=await new Promise((resolve,reject)=>{
                const stream=cloudinary.uploader.upload_stream({
                    upload_preset:uploadPreset,
                    folder:isVideo?'course-videos':file.fieldname==='certificate'?'instructor-certificate': 'course-thumbnails',
                    resource_type:'auto',
                    chunk_size:6000000,
                    eager:isVideo?[{format:'mp4',quality:'auto'}]:undefined
                },
                (error,result)=>{
                    if(error){
                        console.error('Cloudinary Upload Error:',error)
                        return reject(error)
                    }
                    resolve(result as UploadApiResponse)
                }
            )
            stream.end(file.buffer)
        })
        console.log('Cloudinary Upload Result:',result)
        return result.secure_url
        }catch(error){
            throw new Error(`File upload failed:${error.message||error}`)
        }
    }

   
}
