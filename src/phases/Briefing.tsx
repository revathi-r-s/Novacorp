import { ArrowRight, CalendarDays, FileWarning, Server, Users } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

export default function Briefing() {
  const updatePhase = useGame((s) => s.updatePhase);
  return <div className="phase-screen">
    <div className="page-heading"><div><div className="eyebrow">PHASE 01 / INITIAL RESPONSE</div><h1>Incident briefing</h1><p>Review the initial report before entering the investigation console.</p></div><span className="severity high">P1 · HIGH PRIORITY</span></div>
    <Panel className="briefing-report"><div className="report-title"><div className="report-icon"><FileWarning size={21} /></div><div><span>INCIDENT REPORT / NC-IR-2026-071</span><h2>Hydra Trojan suspected on production host</h2></div><span className="report-status">OPEN</span></div>
      <p className="report-summary">The security operations team has detected unusual outbound traffic and an unknown account accessing a temporary directory on a production server. Your team must identify the suspicious login, trace the process, and contain the simulated threat.</p>
      <div className="report-facts"><div><CalendarDays size={16} /><span>DETECTED AT<b>17 Oct 2026 · 03:07</b></span></div><div><Server size={16} /><span>AFFECTED SERVER<b>NC-ALPHA-07</b></span></div><div><Users size={16} /><span>EMPLOYEES ONLINE<b>e1023 · e4471 · e8802</b></span></div></div>
      <div className="report-callout"><AlertIcon /> <span><b>Initial clue</b> — unusual outbound traffic and an unknown user in <code>/tmp</code>. Find the login record that does not belong.</span></div>
    </Panel>
    <div className="section-heading"><h3>Response objectives</h3><span>4 tasks</span></div>
    <div className="objective-grid"><div className="objective-card"><span>01</span><b>Investigate</b><p>Inspect logs and identify suspicious activity.</p></div><div className="objective-card"><span>02</span><b>Verify</b><p>Recover evidence fragments from the vault.</p></div><div className="objective-card"><span>03</span><b>Trace</b><p>Correlate process and network evidence.</p></div><div className="objective-card"><span>04</span><b>Contain</b><p>Respond to the crisis before time expires.</p></div></div>
    <div className="phase-actions"><span className="muted"><ShieldIcon /> All evidence is simulated for training.</span><button className="primary-btn" onClick={() => updatePhase("explore")}>Enter investigation console <ArrowRight size={16} /></button></div>
  </div>;
}
function AlertIcon() { return <FileWarning size={18} />; }
function ShieldIcon() { return <span aria-hidden="true">◆</span>; }
