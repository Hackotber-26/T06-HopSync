// Ridify — ID verification uploads, backed by Drive + a Sheet.
// Deploy: script.google.com/home → New project → paste this in →
// Deploy → New deployment → type "Web app" → execute as "Me",
// access "Anyone" → copy the /exec URL into VITE_APPS_SCRIPT_URL.
//
// Fill these two IDs in before deploying:
const FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE'; // a Drive folder you own
const SHEET_ID = 'PASTE_SHEET_ID_HERE'; // a Google Sheet you own
const SHEET_NAME = 'Submissions';

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.action === 'upload') return handleUpload(body);
  if (body.action === 'updateStatus') return handleUpdateStatus(body);
  return json({ error: 'Unknown action' });
}

function doGet(e) {
  if (e.parameter.action === 'list') return handleList();
  return json({ error: 'Unknown action' });
}

function handleUpload(body) {
  const { name, email, fileName, mimeType, data } = body;
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const blob = Utilities.newBlob(Utilities.base64Decode(data), mimeType, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const id = Utilities.getUuid();
  getSheet().appendRow([id, new Date(), name, email, file.getId(), file.getUrl(), 'pending']);
  return json({ ok: true, id, fileUrl: file.getUrl() });
}

function handleList() {
  const rows = getSheet().getDataRange().getValues().slice(1);
  const items = rows.map((r) => ({
    id: r[0],
    submittedAt: r[1],
    name: r[2],
    email: r[3],
    fileId: r[4],
    fileUrl: r[5],
    status: r[6],
  }));
  return json({ items });
}

function handleUpdateStatus(body) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === body.id) {
      sheet.getRange(i + 1, 7).setValue(body.status);
      return json({ ok: true });
    }
  }
  return json({ error: 'Not found' });
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'submittedAt', 'name', 'email', 'fileId', 'fileUrl', 'status']);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
