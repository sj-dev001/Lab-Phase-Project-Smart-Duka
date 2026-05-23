import { createUploadthing, type FileRouter } from 'uploadthing/express';
import { env } from '../config/env';

const f = createUploadthing();

export const ourFileRouter = {
  // Product images uploader
  productImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      // Verify request is authenticated (you can add auth logic here)
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for', file.name);
      return { uploadedBy: 'ProductImageUpload', url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
