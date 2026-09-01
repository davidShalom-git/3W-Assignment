const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer gives us the file as a memory buffer, we turn it into a data URI
// and hand it to cloudinary directly - avoids writing anything to disk
// (Render's disk gets wiped on every redeploy so local storage isn't an option)
async function uploadImage(fileBuffer, mimetype) {
  const dataUri = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'social-app-posts',
  });
  return result.secure_url;
}

module.exports = { uploadImage };
