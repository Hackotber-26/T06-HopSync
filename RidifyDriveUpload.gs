/**
 * Ridify Google Drive upload endpoint
 *
 * Deploy as a Google Apps Script Web App.
 * Configure Script Properties:
 *   RIDIFY_UPLOAD_SECRET = a long random secret shared only with the backend
 *   RIDIFY_DRIVE_FOLDER_ID = (optional) existing Drive folder ID
 *
 * Expected POST JSON:
 * {
 *   "token": "the shared secret",
 *   "userId": "backend-user-id",
 *   "fileName": "identity-card-front.jpg",
 *   "mimeType": "image/jpeg",
 *   "fileBase64": "...base64 without data: prefix..."
 * }
 *
 * Allowed types: JPEG, PNG, PDF. Maximum decoded size: 8 MB.
 * The script does NOT make uploaded files public.
 */

const ROOT_FOLDER_NAME = 'Ridify Verified ID Cards';
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
]);

function doPost(e) {
  try {
    const body = JSON.parse(e && e.postData && e.postData.contents ? e.postData.contents : '{}');
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty('RIDIFY_UPLOAD_SECRET');

    if (!expectedSecret) {
      return jsonResponse({ success: false, error: 'Server upload secret is not configured.' });
    }

    if (!body.token || body.token !== expectedSecret) {
      return jsonResponse({ success: false, error: 'Unauthorized.' });
    }

    const userId = String(body.userId || '').trim();
    const fileName = sanitizeFileName(body.fileName || 'identity-document');
    const mimeType = String(body.mimeType || '').toLowerCase().trim();
    const fileBase64 = String(body.fileBase64 || '').replace(/^data:[^,]*;base64,/, '').replace(/\s/g, '');

    if (!userId || userId.length > 128) {
      return jsonResponse({ success: false, error: 'A valid userId is required.' });
    }
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return jsonResponse({ success: false, error: 'Unsupported file type. Upload a JPG, PNG, or PDF.' });
    }
    if (!fileBase64) {
      return jsonResponse({ success: false, error: 'File content is missing.' });
    }

    const bytes = Utilities.base64Decode(fileBase64);
    if (bytes.length === 0 || bytes.length > MAX_FILE_BYTES) {
      return jsonResponse({ success: false, error: 'File must be between 1 byte and 8 MB.' });
    }

    const rootFolder = getOrCreateRootFolder(properties);
    const userFolder = getOrCreateUserFolder(rootFolder, userId);
    const blob = Utilities.newBlob(bytes, mimeType, fileName);
    const file = userFolder.createFile(blob);
    file.setDescription('Ridify identity document. User ID: ' + userId + '. Access restricted to Drive permissions.');

    // Return the file ID for backend metadata storage. Do not make the file public.
    return jsonResponse({
      success: true,
      fileId: file.getId(),
      fileName: file.getName(),
      mimeType: file.getMimeType(),
      sizeBytes: file.getSize(),
    });
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, error: 'Upload failed.' });
  }
}

function getOrCreateRootFolder(properties) {
  const savedId = properties.getProperty('RIDIFY_DRIVE_FOLDER_ID');
  if (savedId) {
    try {
      return DriveApp.getFolderById(savedId);
    } catch (error) {
      console.warn('Saved Ridify folder ID was unavailable; creating a new folder.');
    }
  }

  const folders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(ROOT_FOLDER_NAME);
  properties.setProperty('RIDIFY_DRIVE_FOLDER_ID', folder.getId());
  return folder;
}

function getOrCreateUserFolder(rootFolder, userId) {
  // Use the backend's stable internal user ID, not an email address or government ID.
  const folderName = 'user_' + userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const folders = rootFolder.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : rootFolder.createFolder(folderName);
}

function sanitizeFileName(name) {
  return String(name)
    .replace(/[\\/:*?"<>|\r\n]/g, '_')
    .replace(/\.\./g, '_')
    .slice(0, 120) || 'identity-document';
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the Apps Script editor to create/check the Drive folder. */
function setupRidifyDriveFolder() {
  const properties = PropertiesService.getScriptProperties();
  const folder = getOrCreateRootFolder(properties);
  Logger.log('Ridify Drive folder: ' + folder.getName());
  Logger.log('Folder ID: ' + folder.getId());
}
