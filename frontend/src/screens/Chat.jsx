import { useState } from 'react';
import { BackArrow, SendGlyph, CheckBadge } from '../icons';
import { liveRide } from '../mock/data';

const SEED = [
  { id: 1, from: 'them', text: "I'm at Gate A, by the ticket counter.", time: '6:48 PM' },
  { id: 2, from: 'me', text: 'On my way, 2 minutes out!', time: '6:49 PM' },
  { id: 3, from: 'them', text: 'No rush, I\'ll wait near the yellow pillar.', time: '6:49 PM' },
];

export default function Chat({ onBack }) {
  const [messages, setMessages] = useState(SEED);
  const [text, setText] = useState('');

  function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), from: 'me', text: text.trim(), time: 'Now' }]);
    setText('');
  }

  return (
    <div className="flex flex-col h-full min-h-dvh">
      <header className="bg-ink text-paper px-5 pt-[calc(env(safe-area-inset-top)+1.1rem)] pb-4 flex items-center gap-3">
        <button onClick={onBack} aria-label="Back" className="shrink-0">
          <BackArrow color="#fff" />
        </button>
        <div className="w-9 h-9 rounded-full bg-paper text-ink flex items-center justify-center font-semibold shrink-0">
          {liveRide.driver[0]}
        </div>
        <div className="min-w-0">
          <p className="font-semibold flex items-center gap-1.5 truncate">
            {liveRide.driver} <CheckBadge size={14} />
          </p>
          <p className="text-xs text-paper/60">{liveRide.status}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={m.from === 'me' ? 'text-right' : ''}>
            <span
              className={`inline-block rounded-2xl px-4 py-2.5 text-[15px] max-w-[78%] text-left ${
                m.from === 'me' ? 'bg-ink text-paper' : 'bg-paper-raised border border-rule'
              }`}
            >
              {m.text}
            </span>
            <p className="text-xs text-ink-soft mt-1">{m.time}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={send}
        className="flex items-center gap-2 px-5 py-3 border-t border-rule bg-paper-raised pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${liveRide.driver}…`}
          className="flex-1 field"
        />
        <button type="submit" aria-label="Send" className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
          <SendGlyph color="#fff" />
        </button>
      </form>
    </div>
  );
}
