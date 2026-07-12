import cloudinary from "../config/cloudinary.js";

export const uploadBuffer = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto", original_filename: file.originalname },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id, originalName: file.originalname, mimeType: file.mimetype, size: file.size });
      }
    );
    stream.end(file.buffer);
  });
