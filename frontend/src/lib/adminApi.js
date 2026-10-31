const BASE = import.meta.env.VITE_APPS_SCRIPT_URL;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Apps Script web apps choke on a JSON-type POST (CORS preflight); sending
// text/plain keeps it a "simple request" while the body is still JSON.
function post(body) {
  return fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) }).then(
    (r) => r.json(),
  );
}

export async function uploadVerification({ name, email, file }) {
  const data = await fileToBase64(file);
  return post({ action: 'upload', name, email, fileName: file.name, mimeType: file.type, data });
}

export async function listSubmissions() {
  const res = await fetch(`${BASE}?action=list`);
  const { items } = await res.json();
  return items || [];
}

export function updateStatus(id, status) {
  return post({ action: 'updateStatus', id, status });
}
