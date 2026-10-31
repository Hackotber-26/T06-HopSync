/**
 * Ridify ID verification upload endpoint.
 * Deploy this project as a web app that executes as the deploying account.
 * Keep the Drive folder private; admins can be granted Drive access separately.
 */
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const configuredSecret = PropertiesService.getScriptProperties().getProperty('UPLOAD_SECRET');
    if (!configuredSecret || !payload.secret || payload.secret !== configuredSecret) {
      return jsonResponse({ status: 'error', message: 'Unauthorized.' });
    }

    const filename = safeFilename(payload.filename);
    const email = String(payload.email || '').trim().toLowerCase();
    const base64 = String(payload.base64 || '').replace(/^data:[^,]*;base64,/, '');
    if (!filename || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !base64) {
      return jsonResponse({ status: 'error', message: 'Invalid upload details.' });
    }

    const bytes = Utilities.base64Decode(base64);
    if (!bytes.length || bytes.length > MAX_FILE_BYTES) {
      return jsonResponse({ status: 'error', message: 'File must be between 1 byte and 8 MB.' });
    }

    const mimeType = mimeTypeFor(filename);
    if (ALLOWED_MIME_TYPES.indexOf(mimeType) < 0) {
      return jsonResponse({ status: 'error', message: 'Only JPG, PNG, WEBP, and PDF files are accepted.' });
    }

    const blob = Utilities.newBlob(bytes, mimeType, filename);
    const folder = uploadFolder();
    const file = folder.createFile(blob);
    file.setDescription('Ridify ID verification upload for ' + email);

    return jsonResponse({ status: 'success', url: file.getUrl(), fileId: file.getId() });
  } catch (error) {
    // Do not log request bodies, secrets, or uploaded document data.
    console.error('ID upload failed: ' + error.message);
    return jsonResponse({ status: 'error', message: 'Upload could not be processed.' });
  }
}

function uploadFolder() {
  const properties = PropertiesService.getScriptProperties();
  const folderId = properties.getProperty('DRIVE_FOLDER_ID');
  if (folderId) return DriveApp.getFolderById(folderId);

  const folderName = 'Ridify ID Verifications';
  const existing = DriveApp.getFoldersByName(folderName);
  if (existing.hasNext()) return existing.next();
  return DriveApp.createFolder(folderName);
}

function safeFilename(value) {
  const name = String(value || '').split(/[\\/]/).pop().replace(/[\r\n\0]/g, '').trim();
  if (!name || name.length > 180) return '';
  return name;
}

function mimeTypeFor(filename) {
  const extension = filename.toLowerCase().split('.').pop();
  const types = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' };
  return types[extension] || 'application/octet-stream';
}

// to account for the 

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
