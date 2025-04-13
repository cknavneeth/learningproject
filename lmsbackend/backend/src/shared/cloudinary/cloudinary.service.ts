import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private configservice: ConfigService) {
        cloudinary.config({
            cloud_name: this.configservice.get<string>('CLOUDINARY_CLOUD_NAME'),
            secure: true,
            api_key: this.configservice.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configservice.get<string>('CLOUDINARY_SECRET_KEY')
        });
    }

    async UploadedFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new Error('No file provided');
        }

        if (!file.buffer) {
            throw new Error('File buffer is empty');
        }

        const uploadPreset = this.configservice.get<string>('CLOUDINARY_UPLOAD_PRESET');
        const isVideo = file.mimetype.includes('video');

        console.log('Preparing to upload file:', {
            mimetype: file.mimetype,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            isVideo
        });

        try {
            const result: UploadApiResponse = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'auto',
                        folder: isVideo ? 'course-videos' : 
                                file.fieldname === 'certificate' ? 'instructor-certificate' : 
                                'course-thumbnails',
                        upload_preset: uploadPreset,
                        chunk_size: 2000000, // 2MB chunks
                        timeout: 600000, // 10 minutes
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary Upload Error:', error);
                            return reject(error);
                        }
                        resolve(result as UploadApiResponse);
                    }
                );

                // Handle stream errors
                stream.on('error', (error) => {
                    console.error('Stream Error:', error);
                    reject(error);
                });

                // Write file buffer to stream in chunks
                const chunkSize = 2000000; // 2MB chunks
                let offset = 0;
                
                function uploadNextChunk() {
                    const chunk = file.buffer.slice(offset, offset + chunkSize);
                    if (chunk.length === 0) {
                        stream.end();
                        return;
                    }
                    
                    const canContinue = stream.write(chunk);
                    offset += chunk.length;
                    
                    if (canContinue) {
                        uploadNextChunk();
                    } else {
                        stream.once('drain', uploadNextChunk);
                    }
                }

                uploadNextChunk();
            });

            console.log('Upload successful:', {
                url: result.secure_url,
                fileType: file.mimetype,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            });

            return result.secure_url;

        } catch (error) {
            console.error('Upload failed:', error);
            
            let errorMessage = 'File upload failed: ';
            
            if (error.http_code === 499) {
                errorMessage += 'Upload timed out. Please try again with a smaller file.';
            } else if (error.http_code === 502) {
                errorMessage += 'Server connection issue. Please try again.';
            } else {
                errorMessage += error.message || 'Unknown error occurred';
            }
            
            throw new Error(errorMessage);
        }
    }
}