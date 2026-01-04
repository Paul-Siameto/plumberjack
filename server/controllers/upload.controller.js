import { v2 as cloudinary } from 'cloudinary';

const useCloudinary = !!process.env.CLOUDINARY_URL;
if (useCloudinary) {
  cloudinary.config({ secure: true });
}

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    if (useCloudinary) {
      const result = await cloudinary.uploader.upload_stream({ folder: 'aquamart' }, (error, result) => {
        if (error) return next(error);
        return res.status(201).json({ url: result.secure_url });
      });
      // Write stream
      result.end(req.file.buffer);
    } else {
      // Mock: return a data URL placeholder
      const base64 = req.file.buffer.toString('base64');
      return res.status(201).json({ url: `data:${req.file.mimetype};base64,${base64}` });
    }
  } catch (e) { next(e); }
}


