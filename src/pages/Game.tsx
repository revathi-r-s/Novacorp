import { useNavigate } from "react-router-dom";
import { Activity, AlertTriangle, CheckCircle2, CircleDot, Clock3, LogOut, Shield, ShieldAlert, ShieldCheck, TerminalSquare } from "lucide-react";
import { useGame } from "../store/game";
import Chat from "../components/Chat";
import Briefing from "../phases/Briefing";
import Explore from "../phases/Explore";
import Vault from "../phases/Vault";
import Curveball from "../phases/Curveball";
import Trace from "../phases/Trace";
import Secured from "../phases/Secured";
import Crisis from "../phases/Crisis";
import Done from "../phases/Done";
import type { Phase } from "../types/api";

const phaseInfo: { id: Phase; label: string }[] = [
  { id: "briefing", label: "Incident briefing" }, { id: "explore", label: "Explore evidence" },
  { id: "vault", label: "Evidence vault" }, { id: "curveball", label: "Suspicious email" },
  { id: "trace", label: "Trace activity" }, { id: "secured", label: "System secured" },
  { id: "crisis", label: "Active crisis" }, { id: "done", label: "Debrief" }
];

export default function Game() {
  const state = useGame((s) => s.state);
  const reset = useGame((s) => s.reset);
  const nav = useNavigate();
  if (!state) return <main className="no-session"><ShieldAlert size={36} /><h2>No active session</h2><p>Start a new simulation session to continue.</p><button className="primary-btn" onClick={() => nav("/")}>Return to login</button></main>;
  const phaseIndex = phaseInfo.findIndex((p) => p.id === state.phase);
  const PhaseScreen = {
    briefing: Briefing, explore: Explore, vault: Vault, curveball: Curveball,
    trace: Trace, secured: Secured, crisis: Crisis, done: Done
  }[state.phase];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><div className="brand-mark"><Shield size={19} /></div><div><b>NOVACORP</b><small>SECURITY OPERATIONS</small></div></div>
        <div className="workspace-label">WORKSPACE <span>⌄</span></div>
        <div className="workspace-card"><div className="workspace-icon"><TerminalSquare size={18} /></div><div><b>Incident NC-07</b><small>Hydra Trojan investigation</small></div><span className="workspace-status" /></div>
        <div className="nav-label">MISSION FLOW</div>
        <nav className="phase-nav">
          {phaseInfo.map((p, i) => {
            const completed = i < phaseIndex;
            const active = p.id === state.phase;
            return <div key={p.id} className={`phase-nav-item ${active ? "active" : ""} ${completed ? "completed" : ""}`}>
              <span className="phase-number">{completed ? <CheckCircle2 size={15} /> : active ? <CircleDot size={15} /> : String(i + 1).padStart(2, "0")}</span>
              <span>{p.label}</span>{active && <span className="active-arrow">›</span>}
            </div>;
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="integrity-card"><div className="integrity-title"><ShieldCheck size={15} /> SYSTEM INTEGRITY <b>{state.integrity}%</b></div><div className="integrity-track"><span style={{ width: `${state.integrity}%` }} /></div><small>{state.integrity > 80 ? "Stable · no critical impact" : state.integrity > 50 ? "Warning · impact detected" : "Critical · act immediately"}</small></div>
        <div className="sidebar-user"><div className="avatar">{state.role === "analyst" ? "A" : "M"}</div><div><b>{state.teamId}</b><small>{state.role.toUpperCase()} ROLE</small></div><button title="Exit simulation" onClick={() => { reset(); nav("/"); }}><LogOut size={16} /></button></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="breadcrumbs"><span>Operations</span><span>/</span><b>{phaseInfo[phaseIndex]?.label}</b></div><div className="topbar-right"><span className="top-live"><span className="live-dot" /> SIMULATION ACTIVE</span><span className="top-divider" /><span className="top-clock"><Clock3 size={15} /> {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span></div></header>
        <div className="work-layout"><div className="phase-content"><div className="mission-banner"><div className="mission-alert"><AlertTriangle size={17} /></div><div><b>SECURITY INCIDENT DETECTED</b><span>Host NC-ALPHA-07 · Hydra Trojan · Priority P1</span></div><div className="banner-tag">IN PROGRESS</div></div><PhaseScreen /></div><Chat /></div>
        <footer className="app-footer"><span><Activity size={13} /> NOVACORP RESPONSE PLATFORM</span><span>DEMO DATA · NOT CONNECTED TO A LIVE NETWORK</span></footer>
      </main>
    </div>
  );
}
