import { useState } from "react";
import { ArrowRight, ChevronRight, FileText, Folder, FolderOpen, Search, ShieldAlert, UserRound, Waypoints, Eye, Users } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

const files = [
  { name: "var", path: "/var", type: "folder" },
  { name: "auth.log", path: "/var/log/auth.log", type: "file" },
  { name: "sys.log", path: "/var/log/sys.log", type: "file" },
  { name: ".hidden", path: "/tmp/.hidden", type: "file" },
  { name: "leave_roster.txt", path: "/tmp/leave_roster.txt", type: "file" },
  { name: "cleanup.log", path: "/tmp/cleanup.log", type: "file" },
  { name: "after-cleanup.task", path: "/etc/cron.d/after-cleanup.task", type: "file" },
  { name: "payload.sh", path: "/home/hydra/payload.sh", type: "file" }
];
const logs = [
  { time: "02:11:04", user: "e1023", ip: "10.0.0.5", action: "Successful login", suspicious: false },
  { time: "03:07:19", user: "ghost", ip: "203.0.113.9", action: "Login accepted · account not in employee directory", suspicious: true },
  { time: "03:08:02", user: "ghost", ip: "203.0.113.9", action: "Temporary directory accessed", suspicious: true },
  { time: "04:22:48", user: "e4471", ip: "10.0.0.9", action: "Successful login · outside approved schedule", suspicious: true },
  { time: "04:23:01", user: "svc_backup", ip: "10.0.0.9", action: "Background task started", suspicious: false }
];
const evidenceText: Record<string, string> = {
  "/var/log/auth.log": "AUTHENTICATION LOG\n02:11:04 e1023 from 10.0.0.5 — successful login\n03:07:19 ghost from 203.0.113.9 — accepted\n03:08:02 ghost accessed /tmp",
  "/var/log/sys.log": "SYSTEM LOG\nHydra payload started under PID 4092. Outbound traffic is visible on port 4444.",
  "/tmp/.hidden": "HIDDEN FILE\nA user named svc_backup is present in the local account database. No employee owner is listed.",
  "/tmp/leave_roster.txt": "HR LEAVE ROSTER — INTERNAL\ne4471 was approved for leave on 17 Oct 2026. Badge access should be disabled for the day. An authentication event was nevertheless recorded at 04:22.",
  "/tmp/cleanup.log": "RECOVERY NOTE\nDo not delete /tmp. It contains incident evidence. Message asking for immediate deletion was not sent by the real sysadmin.",
  "/etc/cron.d/after-cleanup.task": "SCHEDULED TASK\nsvc_backup runs after cleanup. Destination: 198.51.100.24:8443. This task is unrelated to Hydra's PID 4092.",
  "/home/hydra/payload.sh": "SIMULATED SCRIPT METADATA\nPID 4092 · owner ghost · connects to 203.0.113.9:4444. This is the Hydra decoy payload.",
  "/var": "DIRECTORY\nContains system logs. Open auth.log and sys.log to inspect evidence."
};

export default function Explore() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("/var/log/auth.log");
  const state = useGame((s) => s.state);
  const role = state?.role ?? "analyst";
  const setRole = useGame((s) => s.setRole);
  const updatePhase = useGame((s) => s.updatePhase);
  const addFragment = useGame((s) => s.addFragment);
  const setInspectedLog = useGame((s) => s.setInspectedLog);
  const setFoundLeaveClue = useGame((s) => s.setFoundLeaveClue);
  const setFoundHiddenAccount = useGame((s) => s.setFoundHiddenAccount);
  const setFoundTaskClue = useGame((s) => s.setFoundTaskClue);
  const filtered = logs.filter((l) => `${l.user} ${l.ip} ${l.action}`.toLowerCase().includes(query.toLowerCase()));
  const inspectSelected = () => {
    if (selected === "/tmp/leave_roster.txt") setFoundLeaveClue();
    if (selected === "/tmp/.hidden") setFoundHiddenAccount();
    if (selected === "/etc/cron.d/after-cleanup.task") setFoundTaskClue();
  };
  return <div className="phase-screen">
    <div className="page-heading"><div><div className="eyebrow">PHASE 02 / EVIDENCE COLLECTION</div><h1>{role === "monitor" ? "Monitor dashboard" : "Analyst console"}</h1><p>{role === "monitor" ? "Review authentication records and outbound telemetry. Share the 03:07 account with the Analyst." : "Explore folders, log files and hidden files. An unfamiliar account appears in the user list without an explanation yet."}</p></div><span className="severity medium"><Waypoints size={13} /> HOST CONNECTED</span></div>
    <div className="phase-actions" style={{ marginTop: 0, marginBottom: 14 }}><span className="muted">Demo collaboration: switch views to compare the Analyst and Monitor evidence.</span><button className="secondary-btn" onClick={() => setRole(role === "analyst" ? "monitor" : "analyst")}><Users size={15} /> Switch to {role === "analyst" ? "Monitor" : "Analyst"} view</button></div>
    <div className="metric-row"><div className="metric-card"><span>LOG RECORDS</span><b>1,284</b><small>Last 24 hours</small></div><div className="metric-card"><span>FLAGGED EVENTS</span><b className="red-text">03</b><small>Require investigation</small></div><div className="metric-card"><span>ACTIVE EMPLOYEES</span><b>03</b><small>On NC-ALPHA-07</small></div><div className="metric-card"><span>OUTBOUND ALERTS</span><b className="amber-text">02</b><small>Two separate destinations</small></div></div>
    <div className="explore-grid">
      <Panel><div className="panel-heading"><div><h3>Filesystem explorer</h3><p>Simulated host file tree</p></div><FolderOpen size={17} /></div><div className="file-tree">
        <div className="tree-root"><Folder size={15} /> <span>/</span></div>
        {files.map((f) => <button key={f.path} className={`tree-item ${selected === f.path ? "tree-selected" : ""}`} onClick={() => setSelected(f.path)}><span className="tree-indent">{f.type === "file" ? <span className="tree-branch">└</span> : <ChevronRight size={13} />}</span>{f.type === "folder" ? <Folder size={14} /> : <FileText size={14} />}<span>{f.name}</span>{f.name === ".hidden" && <span className="tree-alert">!</span>}</button>)}
      </div><div className="selected-file"><span>SELECTED PATH</span><code>{selected}</code><pre style={{ whiteSpace: "pre-wrap", fontSize: 10, lineHeight: 1.7, color: "#b7c7d9", margin: "10px 0" }}>{evidenceText[selected] ?? "Select a file to read the simulated evidence."}</pre><button className="secondary-btn" onClick={inspectSelected}><Eye size={14} /> Inspect selected evidence</button>{state?.foundHiddenAccount && <small className="green-text">Hidden account clue recorded.</small>}{state?.foundLeaveClue && <small className="green-text">Leave roster clue recorded.</small>}{state?.foundTaskClue && <small className="green-text">Scheduled-task clue recorded.</small>}</div></Panel>
      <Panel className="log-panel"><div className="panel-heading"><div><h3>{role === "monitor" ? "Monitor authentication records" : "Authentication log"}</h3><p>auth.log · relevant events</p></div><span className="log-count">{logs.length} EVENTS</span></div><div className="search-field"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by user, IP, action…" /></div><div className="log-table-wrap"><table className="data-table"><thead><tr><th>TIME</th><th>USER / SOURCE</th><th>EVENT</th><th>STATUS</th></tr></thead><tbody>{filtered.map((l) => <tr key={l.time} className={l.suspicious ? "suspicious-row" : ""} onClick={() => { if (l.time === "03:07:19") { setInspectedLog(); addFragment("FRAG1-UNKNOWN-LOGIN"); } }} style={{ cursor: l.time === "03:07:19" ? "pointer" : "default" }}><td className="mono">{l.time}</td><td><b>{role === "analyst" && l.time === "03:07:19" ? "unknown-user" : l.user}</b><small>{role === "analyst" && l.time === "03:07:19" ? "unknown location" : l.ip}</small></td><td>{role === "analyst" && l.time === "03:07:19" ? "Unrecognized login accepted" : l.action}</td><td>{l.suspicious ? <span className="status-badge danger"><ShieldAlert size={12} /> FLAGGED</span> : <span className="status-badge safe">NORMAL</span>}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No log entries match this filter.</div>}</div>{role === "monitor" ? <div className="log-insight"><ShieldAlert size={16} /><span><b>Monitor evidence</b> — the 03:07 login was <code>ghost</code> from <code>203.0.113.9</code>. Communicate this to the Analyst to unlock the vault.</span></div> : <div className="log-insight"><ShieldAlert size={16} /><span><b>Investigation note</b> — inspect the unusual 03:07 record to collect the first kill-switch fragment. The unfamiliar user account has no explanation yet.</span></div>}</Panel>
    </div>
    <div className="phase-actions"><span className="muted"><UserRound size={14} /> Fragments collected: {state?.fragments.length ?? 0} / 4</span><button className="primary-btn" disabled={!state?.inspectedLog} onClick={() => updatePhase("vault")}>Open evidence vault <ArrowRight size={16} /></button></div>
    {!state?.inspectedLog && <p className="muted">Open <code>/var/log/auth.log</code>, then click the anomalous <code>03:07:19</code> login row to recover fragment 1.</p>}
  </div>;
}
