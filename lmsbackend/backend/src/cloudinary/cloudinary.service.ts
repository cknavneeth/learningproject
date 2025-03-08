import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService{
    constructor(private configservice:ConfigService){
        cloudinary.config({
            cloud_name: this.configservice.get<string>('CLOUDINARY_CLOUD_NAME'),
            secure:true,
            api_key:this.configservice.get<string>('CLOUDINARY_API_KEY'),
            api_secret:this.configservice.get<string>('CLOUDINARY_SECRET_KEY')
        });
    }


    async UploadedFile(file:Express.Multer.File):Promise<string>{

        const uploadPreset=this.configservice.get<string>('CLOUDINARY_UPLOAD_PRESET')

       console.log('upload preset ahneyy',uploadPreset)
        try {
            const result: UploadApiResponse = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        upload_preset: uploadPreset,
                        folder: 'instructor-certificate',
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary Upload Error:', error);
                            return reject(error);
                        }
                        resolve(result as UploadApiResponse);
                    }
                );

                stream.end(file.buffer);
            });
    
            console.log('Cloudinary Upload Result:', result);
    
            return result.secure_url;
            
        } catch (error) {
            throw new Error(`Image upload failed: ${error.message || error}`);
            throw new Error('image upload failed')
        }
       
    }
}


