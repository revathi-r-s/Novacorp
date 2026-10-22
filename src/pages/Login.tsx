import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Fingerprint, LockKeyhole, Shield, ShieldCheck } from "lucide-react";
import { useGame } from "../store/game";
import type { Role } from "../types/api";

export default function Login() {
  const [teamId, setTeamId] = useState("TEAM-07");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("analyst");
  const setState = useGame((s) => s.setState);
  const nav = useNavigate();
  const [loginError, setLoginError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = password.toLowerCase().replace(/[^a-z0-9]/g, "");
    // Training password is derived from the report: employee ID + incident date (DDMMYYYY) + server name.
    if (normalized !== "hydra07") {
      setLoginError("Access denied. Recheck the employee ID, incident date (DDMMYYYY), and affected server in the report clues.");
      return;
    }
    setLoginError("");
    setState({
      sessionId: crypto.randomUUID(),
      teamId: teamId.trim() || "TEAM-07",
      role,
      phase: "briefing",
      fragments: [],
      integrity: 100,
      actions: [],
      inspectedLog: false,
      foundLeaveClue: false,
      foundHiddenAccount: false,
      foundTaskClue: false,
      hydraStopped: false,
      timeExpired: false
    });
    nav("/game");
  }

  return (
    <main className="login-page">
      <div className="login-grid" />
      <header className="login-top"><div className="brand-mark"><Shield size={22} /></div><span>NOVACORP <i>SECURITY OPERATIONS</i></span><div className="status-pill"><span className="live-dot" /> SIMULATION ONLINE</div></header>
      <section className="login-layout">
        <div className="login-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> INCIDENT RESPONSE EXERCISE / 07</div>
          <h1>Think like an analyst.<br /><span>Act before impact.</span></h1>
          <p className="login-lede">A coordinated cyber incident has been detected inside NovaCorp. Investigate the evidence, collaborate with your team, and contain the threat before the countdown ends.</p>
          <div className="login-clue-card"><b>PRE-AUTH INCIDENT REPORT EXTRACT</b><span>Incident date: <strong>17 October 2026</strong></span><span>Affected server: <strong>NC-ALPHA-07</strong></span><span>Employees online: <strong>e1023 · e4471 · e8802</strong></span><small>Admin password must be reconstructed from the report details; it is not provided directly.</small></div>
          <div className="login-stats">
            <div><Activity size={18} /><b>LIVE EXERCISE</b><small>Interactive scenario</small></div>
            <div><Fingerprint size={18} /><b>DUAL ROLE</b><small>Analyst + Monitor</small></div>
            <div><ShieldCheck size={18} /><b>SAFE SANDBOX</b><small>Mock data only</small></div>
          </div>
        </div>
        <form className="login-card" onSubmit={submit}>
          <div className="card-topline"><span>AUTHENTICATION GATEWAY</span><span className="green-dot" /></div>
          <div className="login-card-icon"><LockKeyhole size={23} /></div>
          <h2>Access console</h2>
          <p className="muted">Enter your team details to begin the exercise.</p>
          <label>TEAM IDENTIFIER</label>
          <input value={teamId} onChange={(e) => setTeamId(e.target.value)} placeholder="e.g. TEAM-07" autoComplete="username" />
          <label>ADMIN ACCESS PASSWORD <span className="optional">SOLVE FROM REPORT</span></label>
          <input value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(""); }} type="password" placeholder="Combine the three report clues" autoComplete="current-password" required /><small className="login-note">
  Password clue: Use the trojan's name and the affected server number.
</small>{loginError && <div className="inline-error" role="alert">{loginError}</div>}
          <label>SELECT YOUR ROLE</label>
          <div className="role-picker">
            <button type="button" className={role === "analyst" ? "role-option selected" : "role-option"} onClick={() => setRole("analyst")}><span className="role-symbol">⌘</span><span><b>Analyst</b><small>Logs & file system</small></span>{role === "analyst" && <span className="role-check">✓</span>}</button>
            <button type="button" className={role === "monitor" ? "role-option selected" : "role-option"} onClick={() => setRole("monitor")}><span className="role-symbol">◉</span><span><b>Monitor</b><small>Login & network</small></span>{role === "monitor" && <span className="role-check">✓</span>}</button>
          </div>
          <button className="primary-btn login-submit">Enter secure console <ArrowRight size={17} /></button>
          <div className="login-note"><ShieldCheck size={14} /> Mock training login. No real credentials or systems are used.</div>
        </form>
      </section>
      <footer className="login-bottom"><span>NC / INCIDENT SIMULATION v1.0</span><span>CLASSIFICATION: INTERNAL TRAINING</span><span>ALL SYSTEMS NOMINAL</span></footer>
    </main>
  );
}
