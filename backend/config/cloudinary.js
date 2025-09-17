const { v2: cloudinary } = require('cloudinary');

// Expect these environment variables to be set
const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.warn('[cloudinary] Missing environment variables:', missing.join(', '));
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function uploadBuffer(buffer, folder, filename, mimetype) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder,
      resource_type: 'image',
      public_id: filename ? filename.replace(/\.[^.]+$/, '') : undefined,
      overwrite: false
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

module.exports = { cloudinary, uploadBuffer };