const fs = require('fs');
const path = require('path');

/**
 * Ensure required upload directories exist in production/deployment environments.
 * Creates the base uploads directory plus common sub-directories used by multer storage.
 * This is idempotent and safe to call multiple times.
 */
function ensureUploadDirs() {
  const base = path.join(__dirname, '..', 'uploads');
  const subDirs = ['images', 'audio', 'documents', 'misc'];

  try {
    if (!fs.existsSync(base)) {
      fs.mkdirSync(base, { recursive: true });
      console.log('[ensureUploadDirs] Created base uploads directory');
    }
    subDirs.forEach(dir => {
      const full = path.join(base, dir);
      if (!fs.existsSync(full)) {
        fs.mkdirSync(full, { recursive: true });
        console.log(`[ensureUploadDirs] Created ${dir} directory`);
      }
    });
  } catch (err) {
    console.error('[ensureUploadDirs] Failed to ensure upload directories:', err.message);
  }
}

module.exports = { ensureUploadDirs };
