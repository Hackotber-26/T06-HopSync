import { useEffect, useState } from 'react';
import { BackArrow, PersonGlyph } from '../icons';
import { listSubmissions, updateStatus } from '../lib/adminApi';

const DEMO = [
  { id: 'demo-1', name: 'Ananya Rao', email: 'ananya@example.com', submittedAt: new Date().toISOString(), fileId: null, status: 'pending' },
  { id: 'demo-2', name: 'Rahul Nair', email: 'rahul@example.com', submittedAt: new Date().toISOString(), fileId: null, status: 'pending' },
];

export default function AdminVerify({ navigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    listSubmissions()
      .then((data) => setItems(data.length ? data : DEMO))
      .catch(() => {
        setItems(DEMO);
        setDemo(true);
      })
      .finally(() => setLoading(false));
  }, []);

  async function decide(id, status) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
    if (!id.startsWith('demo-')) await updateStatus(id, status).catch(() => {});
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="bg-ink text-paper px-5 pt-[calc(env(safe-area-inset-top)+1.1rem)] pb-4 flex items-center gap-4">
        <button onClick={() => navigate('adminLogin')} aria-label="Back">
          <BackArrow color="#fff" />
        </button>
        <h1 className="font-display text-xl font-semibold">ID Verification</h1>
      </header>

      <div className="px-5 py-5 space-y-4">
        {demo && (
          <p className="text-sm text-ink-soft bg-white rounded-xl p-3">
            Showing demo data — set <code>VITE_APPS_SCRIPT_URL</code> in <code>.env</code> to load real submissions.
          </p>
        )}
        {loading && <p className="text-center text-ink-soft py-10">Loading…</p>}

        {items.map((item) => (
          <div key={item.id} className="border border-rule rounded-2xl bg-paper-raised p-4 flex gap-4">
            {item.fileId ? (
              <img
                src={`https://drive.google.com/thumbnail?id=${item.fileId}&sz=w200`}
                alt={`${item.name}'s ID`}
                className="w-20 h-20 rounded-xl object-cover shrink-0 bg-black/5"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                <PersonGlyph size={28} color="var(--color-ink-soft)" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-ink-soft truncate">{item.email}</p>

              {item.status === 'pending' ? (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => decide(item.id, 'rejected')}
                    className="rounded-full border border-transit-coral text-transit-coral font-semibold py-2 text-sm"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => decide(item.id, 'approved')}
                    className="rounded-full bg-ink text-paper font-semibold py-2 text-sm"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <p
                  className={`mt-3 text-center font-semibold py-2 rounded-full text-sm ${
                    item.status === 'approved' ? 'text-transit-green bg-transit-green-soft' : 'text-transit-coral bg-transit-coral-soft'
                  }`}
                >
                  {item.status === 'approved' ? 'Approved' : 'Rejected'}
                </p>
              )}
            </div>
          </div>
        ))}

        {!loading && items.length === 0 && <p className="text-center text-ink-soft py-10">No submissions yet.</p>}
      </div>
    </div>
  );
}
