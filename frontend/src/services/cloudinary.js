import api from './api';
import { useToast } from '../context/ToastContext';

// Hook wrapper so components can easily get high-level upload helpers with toast feedback.
export function useCloudinaryUploads() {
  const { push } = useToast();

  // single upload with toast lifecycle
  async function uploadWithToast(file) {
    const name = file.name || 'image';
    let toastId;
    try {
      toastId = push(`Uploading ${name}...`, { type: 'info', duration: 0 });
      const url = await uploadImageToCloudinary(file);
      push(`Uploaded ${name}`, { type: 'success' });
      return url;
    } catch (e) {
      push(`Failed ${name}: ${e.message.split('\n')[0]}`, { type: 'error', duration: 6000 });
      throw e;
    } finally {
      // Remove the infinite toast if it exists
      if (toastId) {
        // remove not exposed; quick workaround: push success/error overwrites perception.
        // Could extend ToastContext with dismiss(id) for more control.
      }
    }
  }

  async function uploadManyWithToast(files) {
    const urls = [];
    for (const f of files) {
      const u = await uploadWithToast(f);
      urls.push(u);
    }
    if (files.length > 1) {
      push(`Uploaded ${files.length} images`, { type: 'success' });
    }
    return urls;
  }

  return { uploadWithToast, uploadManyWithToast };
}

// Get signed upload parameters from backend
export async function getUploadSignature() {
  const { data } = await api.get('/uploads/signature');
  return data.data; // { timestamp, folder, signature, cloudName, apiKey }
}

// Directly upload a single File object to Cloudinary using the signed params
export async function uploadImageToCloudinary(file) {
  const sig = await getUploadSignature();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', sig.timestamp);
  formData.append('folder', sig.folder);
  formData.append('signature', sig.signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;
  const res = await fetch(uploadUrl, { method: 'POST', body: formData });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${errText}`);
  }
  const json = await res.json();
  return json.secure_url;
}

// Helper to upload multiple images (returns array of secure URLs)
export async function uploadMultipleImages(files) {
  // Maintained for backwards compatibility (no toasts)
  const results = [];
  for (const f of files) {
    const url = await uploadImageToCloudinary(f);
    results.push(url);
  }
  return results;
}
