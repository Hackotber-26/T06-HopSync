# ID verification via Google Apps Script

1. Create a Drive folder (for ID photos) and a Google Sheet (for the submission log). Copy both IDs from their URLs.
2. [script.google.com](https://script.google.com) → New project → paste `Code.gs` in → fill in `FOLDER_ID` and `SHEET_ID` at the top.
3. Deploy → New deployment → type **Web app** → execute as **Me**, who has access **Anyone**.
4. Copy the `.../exec` URL it gives you into `frontend/.env` as `VITE_APPS_SCRIPT_URL`.
5. Re-run "New deployment" (not "manage deployments") any time you edit `Code.gs` — edits don't go live otherwise.

The frontend posts `Content-Type: text/plain` on purpose: Apps Script web apps don't handle a `Content-Type: application/json` CORS preflight, but a plain-text POST counts as a "simple request" and skips preflight entirely. The body is still parsed as JSON server-side.
