import { useState } from "react";
import { ArrowRight, CheckCircle2, Network, Power, RadioTower, ServerCog, ShieldAlert, KeyRound, RefreshCw } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

const processes = [
  { pid: 812, name: "systemd", user: "root", risk: "Normal" },
  { pid: 1408, name: "sshd", user: "root", risk: "Normal" },
  { pid: 4092, name: "payload.sh", user: "ghost", risk: "Hydra decoy" },
  { pid: 5128, name: "sync-worker", user: "svc_backup", risk: "Hidden task" }
];
const connections = [
  { pid: 812, destination: "10.0.0.1:53", bytes: "1.2 KB", status: "Internal" },
  { pid: 4092, destination: "203.0.113.9:4444", bytes: "18.7 MB", status: "Hydra decoy" },
  { pid: 1408, destination: "10.0.0.9:22", bytes: "3.4 KB", status: "Internal" },
  { pid: 5128, destination: "198.51.100.24:8443", bytes: "steady stream", status: "Still active" }
];
const fragmentLabels = [
  ["FRAG1-UNKNOWN-LOGIN", "Unknown login record"],
  ["FRAG2-VAULT-KEY", "Vault verification"],
  ["FRAG3-PHISHING-EMAIL", "Phishing evidence"],
  ["FRAG4-PROCESS-TRACE", "Process correlation"]
];

export default function Trace() {
  const [killed, setKilled] = useState(false);
  const state = useGame((s) => s.state);
  const addFragment = useGame((s) => s.addFragment);
  const addAction = useGame((s) => s.addAction);
  const updatePhase = useGame((s) => s.updatePhase);
  const setHydraStopped = useGame((s) => s.setHydraStopped);
  const fragments = state?.fragments ?? [];
  const complete = fragmentLabels.every(([id]) => fragments.includes(id));
  const recoverFragment = () => addFragment("FRAG3-PHISHING-EMAIL");
  function stopHydra() {
    setKilled(true); setHydraStopped(); addFragment("FRAG4-PROCESS-TRACE");
  }
  return <div className="phase-screen">
    <div className="page-heading"><div><div className="eyebrow">PHASE 05 / THREAT CORRELATION</div><h1>Trace & final unlock</h1><p>Match the process IDs with their network destinations. Most activity is harmless — one process is Hydra, and another stream is still unexplained.</p></div><span className="severity high"><RadioTower size={13} /> OUTBOUND ANOMALY</span></div>
    <div className="trace-callout"><ShieldAlert size={18} /><div><b>Correlation alert</b><span>PID 4092 (<code>payload.sh</code>) owned by <code>ghost</code> connects to Hydra's decoy endpoint <code>203.0.113.9:4444</code>. A small, steady stream from <code>svc_backup</code> continues to a different destination.</span></div></div>
    <div className="trace-grid"><Panel><div className="panel-heading"><div><h3><ServerCog size={16} /> Running processes</h3><p>NC-ALPHA-07 · process table</p></div><span className="log-count">4 PROCESSES</span></div><table className="data-table"><thead><tr><th>PID</th><th>PROCESS</th><th>USER</th><th>RISK</th></tr></thead><tbody>{processes.map((p) => <tr key={p.pid} className={p.risk !== "Normal" ? "suspicious-row" : ""}><td className="mono">{p.pid}</td><td><b>{p.name}</b></td><td>{p.user}</td><td>{p.risk === "Normal" ? <span className="status-badge safe">NORMAL</span> : <span className="status-badge danger">{p.risk.toUpperCase()}</span>}</td></tr>)}</tbody></table></Panel>
      <Panel><div className="panel-heading"><div><h3><Network size={16} /> Network connections</h3><p>Outbound connection telemetry</p></div><span className="log-count">4 CONNECTIONS</span></div><table className="data-table"><thead><tr><th>PID</th><th>DESTINATION</th><th>DATA OUT</th></tr></thead><tbody>{connections.map((c) => <tr key={c.pid} className={c.pid === 4092 || c.pid === 5128 ? "suspicious-row" : ""}><td className="mono">{c.pid}</td><td><b>{c.destination}</b><small>{c.status}</small></td><td>{c.bytes}</td></tr>)}</tbody></table><div className="log-insight"><ShieldAlert size={16} /><span><b>Monitor's planted clue</b> — isolating Hydra will not stop the steady outbound stream. Remember the hidden account and “after cleanup” task.</span></div></Panel></div>
    {!fragments.includes("FRAG3-PHISHING-EMAIL") && <Panel className="contain-panel"><div className="contain-icon"><RefreshCw size={19} /></div><div className="contain-copy"><b>Recover missing fragment 3</b><p>The team lost the phishing evidence by ignoring or deleting without verification. Recover it from the backup log. Integrity remains {state?.integrity ?? 100}%.</p></div><button className="secondary-btn" onClick={recoverFragment}>Recover fragment</button></Panel>}
    <Panel className="contain-panel"><div className="contain-icon"><Power size={19} /></div><div className="contain-copy"><b>{killed ? "Hydra decoy isolated" : "Isolate Hydra's process"}</b><p>{killed ? "PID 4092 is stopped in the simulation. The separate exfiltration stream is still active." : "Stop PID 4092 at 203.0.113.9:4444. This appears to secure the host, but is only a decoy."}</p></div>{killed ? <span className="status-badge safe"><CheckCircle2 size={13} /> ISOLATED</span> : <button className="danger-btn" onClick={stopHydra}><Power size={15} /> Isolate PID 4092</button>}</Panel>
    <Panel className="vault-question"><div className="vault-label"><KeyRound size={16} /> KILL-SWITCH ASSEMBLY</div><h2>{complete ? "All four fragments recovered" : "Collect all four fragments to assemble the kill-switch"}</h2><div className="fragment-strip" style={{ marginTop: 12 }}>{fragmentLabels.map(([id, label]) => <span key={id} style={{ display: "flex", gap: 8, alignItems: "center", marginRight: 12, marginBottom: 8 }}><CheckCircle2 size={14} color={fragments.includes(id) ? "#36d69b" : "#6f7c90"} /><span><b>{label}</b><small>{fragments.includes(id) ? "RECOVERED" : "LOCKED"}</small></span></span>)}</div><p className="muted">This kill-switch affects only the fictional Hydra process. It does not disable the hidden scheduled task.</p></Panel>
    <div className="phase-actions"><span className="muted">Fragments: {fragments.length} / 4 · Hydra: {state?.hydraStopped ? "isolated" : "running"}</span><button className="primary-btn" disabled={!complete || !state?.hydraStopped} onClick={() => updatePhase("secured")}>Assemble & run kill-switch <ArrowRight size={16} /></button></div>
  </div>;
}
