import { useState, useEffect } from "react";

const SESSIONS = [
  { id: 1, day: "Tuesday", date: "May 19", time: "6:00 PM" },
  { id: 2, day: "Thursday", date: "May 21", time: "6:00 PM" },
  { id: 3, day: "Saturday", date: "May 23", time: "10:00 AM" },
  { id: 4, day: "Tuesday", date: "May 26", time: "6:00 PM" },
];

const MAX_PLAYERS = 12;
const STORAGE_KEY = "beachvol-signups-v1";

const emptySignups = { 1: [], 2: [], 3: [], 4: [] };

// --------------- localStorage helpers ---------------
// For a truly shared experience across users, replace these two functions
// with calls to a backend (e.g. Supabase, Firebase). For now, signups
// persist per-device, which is fine for the organiser to manage.
function loadSignups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : emptySignups;
  } catch {
    return emptySignups;
  }
}
function saveSignups(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}
// ----------------------------------------------------

const GearIcon = ({ type }) => {
  if (type === "ball") return <span title="Ball">🏐</span>;
  if (type === "net") return <span title="Net">🥅</span>;
  if (type === "lines") return <span title="Lines">📏</span>;
  return null;
};

export default function App() {
  const [signups, setSignups] = useState(emptySignups);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", ball: false, net: false, lines: false });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("sessions");

  useEffect(() => {
    setSignups(loadSignups());
  }, []);

  const session = SESSIONS.find((s) => s.id === selected);
  const sessionSignups = selected ? signups[selected] || [] : [];

  const handleJoin = () => {
    if (!form.name.trim()) return;
    const newSignups = {
      ...signups,
      [selected]: [
        ...signups[selected],
        { name: form.name.trim(), gear: { ball: form.ball, net: form.net, lines: form.lines } },
      ],
    };
    setSignups(newSignups);
    saveSignups(newSignups);
    setForm({ name: "", ball: false, net: false, lines: false });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const shareUrl = window.location.href;

  const handleWhatsApp = () => {
    const text = `🏐 Beach Volleyball Sign-ups!\nCheck the sessions and add your name here:\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openSession = (id) => { setSelected(id); setView("detail"); setSubmitted(false); };
  const goBack = () => { setView("sessions"); setSelected(null); };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: #0a1628;
      color: #f0ece0;
      min-height: 100vh;
    }

    .app {
      max-width: 480px;
      margin: 0 auto;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .bg-texture {
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 50% -10%, #1a3a5c 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 100%, #0d2640 0%, transparent 60%),
        #0a1628;
      z-index: 0;
    }

    .sand-bar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 120px;
      background: linear-gradient(to top, #c8a96e22, transparent);
      z-index: 0;
    }

    .content { position: relative; z-index: 1; padding: 0 0 60px; }

    .header {
      padding: 36px 24px 20px;
      border-bottom: 1px solid rgba(200,169,110,0.15);
    }
    .header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
    .back-btn {
      background: rgba(200,169,110,0.12);
      border: none; color: #c8a96e; cursor: pointer;
      font-size: 18px; padding: 6px 10px; border-radius: 8px;
      display: flex; align-items: center; transition: background 0.2s;
    }
    .back-btn:hover { background: rgba(200,169,110,0.22); }
    .logo { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: 2px; color: #f0ece0; line-height: 1; }
    .logo span { color: #c8a96e; }
    .sub { font-size: 13px; color: rgba(240,236,224,0.45); letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }

    .sessions-list { padding: 24px 18px 0; display: flex; flex-direction: column; gap: 14px; }

    .session-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(200,169,110,0.18);
      border-radius: 16px; padding: 20px 22px; cursor: pointer;
      transition: transform 0.18s, border-color 0.18s, background 0.18s;
      position: relative; overflow: hidden;
    }
    .session-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, #c8a96e, #e8c87e, #c8a96e);
      opacity: 0; transition: opacity 0.2s;
    }
    .session-card:hover { transform: translateY(-2px); border-color: rgba(200,169,110,0.4); background: rgba(200,169,110,0.06); }
    .session-card:hover::before { opacity: 1; }

    .card-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .day-label { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 1px; color: #c8a96e; line-height: 1; }
    .date-label { font-size: 13px; color: rgba(240,236,224,0.55); margin-top: 2px; }
    .time-badge {
      background: rgba(200,169,110,0.14); border: 1px solid rgba(200,169,110,0.25);
      color: #c8a96e; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;
    }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
    .player-count { font-size: 13px; color: rgba(240,236,224,0.5); }
    .player-count strong { color: #f0ece0; font-weight: 600; }
    .gear-status { display: flex; gap: 6px; }
    .gear-pill {
      padding: 2px 8px; border-radius: 8px; font-size: 12px;
      display: flex; align-items: center; gap: 4px;
    }
    .gear-pill.ok { background: rgba(100,200,120,0.12); color: #7ec896; border: 1px solid rgba(100,200,120,0.2); }
    .gear-pill.missing { background: rgba(200,100,100,0.1); color: #e0907a; border: 1px solid rgba(200,100,100,0.15); }
    .progress-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; margin-top: 14px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #c8a96e, #e8c87e); transition: width 0.4s ease; }

    .detail { padding: 24px 18px 0; }
    .session-hero { background: rgba(200,169,110,0.07); border: 1px solid rgba(200,169,110,0.2); border-radius: 16px; padding: 22px; margin-bottom: 20px; }
    .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 1px; color: #f0ece0; }
    .hero-meta { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
    .meta-chip { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 12px; color: rgba(240,236,224,0.65); }

    .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1.5px; color: rgba(240,236,224,0.5); margin-bottom: 12px; }

    .gear-needs { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
    .gear-card { flex: 1; min-width: 80px; border-radius: 12px; padding: 12px 10px; text-align: center; border: 1px solid; }
    .gear-card.covered { background: rgba(100,200,120,0.08); border-color: rgba(100,200,120,0.2); color: #7ec896; }
    .gear-card.needed { background: rgba(200,100,80,0.08); border-color: rgba(200,100,80,0.2); color: #e0907a; }
    .gear-card .icon { font-size: 22px; margin-bottom: 4px; }
    .gear-card .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .gear-card .status { font-size: 11px; opacity: 0.7; margin-top: 2px; }

    .player-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
    .player-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 10px 14px; }
    .player-name { font-weight: 500; font-size: 15px; }
    .player-gear { display: flex; gap: 4px; font-size: 16px; }
    .no-players { text-align: center; color: rgba(240,236,224,0.3); font-size: 14px; padding: 20px; }

    .join-form { background: rgba(200,169,110,0.05); border: 1px solid rgba(200,169,110,0.18); border-radius: 16px; padding: 22px; }
    .form-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; margin-bottom: 16px; color: #c8a96e; }
    .name-input {
      width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(200,169,110,0.25);
      border-radius: 10px; padding: 12px 16px; color: #f0ece0;
      font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none;
      transition: border-color 0.2s; margin-bottom: 14px;
    }
    .name-input::placeholder { color: rgba(240,236,224,0.3); }
    .name-input:focus { border-color: rgba(200,169,110,0.6); }
    .gear-label { font-size: 13px; color: rgba(240,236,224,0.5); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
    .gear-toggles { display: flex; gap: 10px; margin-bottom: 18px; }
    .gear-toggle {
      flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 10px 6px; cursor: pointer; text-align: center;
      transition: all 0.18s; color: rgba(240,236,224,0.4);
    }
    .gear-toggle.active { background: rgba(200,169,110,0.15); border-color: rgba(200,169,110,0.5); color: #c8a96e; }
    .gear-toggle .g-icon { font-size: 20px; }
    .gear-toggle .g-label { font-size: 11px; margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .join-btn {
      width: 100%; background: linear-gradient(135deg, #c8a96e, #e8c87e);
      border: none; border-radius: 12px; padding: 14px;
      font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1.5px;
      color: #0a1628; cursor: pointer; transition: opacity 0.2s, transform 0.15s;
    }
    .join-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .join-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .success-msg {
      text-align: center; padding: 12px;
      background: rgba(100,200,120,0.1); border: 1px solid rgba(100,200,120,0.25);
      border-radius: 10px; color: #7ec896; font-weight: 500; font-size: 15px;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .full-badge { text-align: center; padding: 10px; background: rgba(200,100,80,0.1); border: 1px solid rgba(200,100,80,0.2); border-radius: 10px; color: #e0907a; font-size: 14px; }

    .share-bar {
      padding: 16px; background: rgba(255,255,255,0.03);
      border: 1px solid rgba(200,169,110,0.15); border-radius: 14px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .share-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(240,236,224,0.35); margin-bottom: 2px; }
    .share-btns { display: flex; gap: 10px; }
    .wa-btn {
      flex: 1; background: #25D366; border: none; border-radius: 10px;
      padding: 11px 14px; color: white; font-family: 'DM Sans', sans-serif;
      font-weight: 600; font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 7px; transition: opacity 0.2s;
    }
    .wa-btn:hover { opacity: 0.88; }
    .copy-btn {
      background: rgba(200,169,110,0.12); border: 1px solid rgba(200,169,110,0.25);
      border-radius: 10px; padding: 11px 16px; color: #c8a96e;
      font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px;
      cursor: pointer; transition: background 0.2s; white-space: nowrap;
    }
    .copy-btn:hover { background: rgba(200,169,110,0.2); }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="bg-texture" />
        <div className="sand-bar" />
        <div className="content">
          <div className="header">
            <div className="header-top">
              {view === "detail" && <button className="back-btn" onClick={goBack}>←</button>}
              <div>
                <div className="logo">BEACH<span>VOL</span></div>
                <div className="sub">{view === "sessions" ? "Pick your session" : `${session?.day} · ${session?.date}`}</div>
              </div>
            </div>
          </div>

          {view === "sessions" && (
            <div className="sessions-list">
              <div className="share-bar">
                <div className="share-title">📣 Invite your group</div>
                <div className="share-btns">
                  <button className="wa-btn" onClick={handleWhatsApp}>💬 Send on WhatsApp</button>
                  <button className="copy-btn" onClick={handleCopy}>{copied ? "✓ Copied!" : "Copy link"}</button>
                </div>
              </div>

              {SESSIONS.map((s) => {
                const players = signups[s.id] || [];
                const count = players.length;
                const pct = (count / MAX_PLAYERS) * 100;
                const ball = players.some((p) => p.gear.ball);
                const net = players.some((p) => p.gear.net);
                const lines = players.some((p) => p.gear.lines);
                return (
                  <div className="session-card" key={s.id} onClick={() => openSession(s.id)}>
                    <div className="card-row">
                      <div>
                        <div className="day-label">{s.day}</div>
                        <div className="date-label">{s.date}</div>
                      </div>
                      <div className="time-badge">{s.time}</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="card-footer">
                      <div className="player-count"><strong>{count}</strong> / {MAX_PLAYERS} players</div>
                      <div className="gear-status">
                        <div className={`gear-pill ${ball ? "ok" : "missing"}`}>🏐 {ball ? "✓" : "?"}</div>
                        <div className={`gear-pill ${net ? "ok" : "missing"}`}>🥅 {net ? "✓" : "?"}</div>
                        <div className={`gear-pill ${lines ? "ok" : "missing"}`}>📏 {lines ? "✓" : "?"}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view === "detail" && session && (
            <div className="detail">
              <div className="session-hero">
                <div className="hero-title">{session.day}, {session.date}</div>
                <div className="hero-meta">
                  <div className="meta-chip">🕕 {session.time}</div>
                  <div className="meta-chip">👥 {sessionSignups.length}/{MAX_PLAYERS}</div>
                </div>
              </div>

              <div className="section-title">Equipment</div>
              <div className="gear-needs">
                {[{ key: "ball", icon: "🏐", label: "Ball" }, { key: "net", icon: "🥅", label: "Net" }, { key: "lines", icon: "📏", label: "Lines" }].map(({ key, icon, label }) => {
                  const covered = sessionSignups.some((p) => p.gear[key]);
                  const who = sessionSignups.find((p) => p.gear[key])?.name;
                  return (
                    <div className={`gear-card ${covered ? "covered" : "needed"}`} key={key}>
                      <div className="icon">{icon}</div>
                      <div className="label">{label}</div>
                      <div className="status">{covered ? who : "Needed"}</div>
                    </div>
                  );
                })}
              </div>

              <div className="section-title">Players ({sessionSignups.length})</div>
              <div className="player-list">
                {sessionSignups.length === 0 && <div className="no-players">No one yet — be the first!</div>}
                {sessionSignups.map((p, i) => (
                  <div className="player-item" key={i}>
                    <div className="player-name">{p.name}</div>
                    <div className="player-gear">
                      {p.gear.ball && <GearIcon type="ball" />}
                      {p.gear.net && <GearIcon type="net" />}
                      {p.gear.lines && <GearIcon type="lines" />}
                    </div>
                  </div>
                ))}
              </div>

              {sessionSignups.length < MAX_PLAYERS ? (
                <div className="join-form">
                  <div className="form-title">Join this session</div>
                  {submitted ? (
                    <div className="success-msg">🎉 You're in! See you on the sand.</div>
                  ) : (
                    <>
                      <input className="name-input" placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                      <div className="gear-label">Can you bring? (optional)</div>
                      <div className="gear-toggles">
                        {[{ key: "ball", icon: "🏐", label: "Ball" }, { key: "net", icon: "🥅", label: "Net" }, { key: "lines", icon: "📏", label: "Lines" }].map(({ key, icon, label }) => (
                          <div key={key} className={`gear-toggle ${form[key] ? "active" : ""}`} onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}>
                            <div className="g-icon">{icon}</div>
                            <div className="g-label">{label}</div>
                          </div>
                        ))}
                      </div>
                      <button className="join-btn" disabled={!form.name.trim()} onClick={handleJoin}>Sign Me Up</button>
                    </>
                  )}
                </div>
              ) : (
                <div className="full-badge">This session is full 🏐</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
