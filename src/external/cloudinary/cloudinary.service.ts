import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    if (!file) {
      throw new Error('No file provided');
    }

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            this.logger.error(
              `Error uploading file to Cloudinary: ${error.message}`,
            );
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      const readStream = Readable.from(file.buffer);
      readStream.pipe(uploadStream);
    });
  }
}
