import { useState } from "react";
import { ArrowRight, MailWarning, ShieldAlert, Trash2, EyeOff, CheckCircle2 } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

export default function Curveball() {
  const [choice, setChoice] = useState<"verify" | "delete" | "ignore" | null>(null);
  const updatePhase = useGame((s) => s.updatePhase);
  const addFragment = useGame((s) => s.addFragment);
  const addAction = useGame((s) => s.addAction);
  const setEmailChoice = useGame((s) => s.setEmailChoice);
  const state = useGame((s) => s.state);
  function choose(next: "verify" | "delete" | "ignore") {
    setChoice(next); setEmailChoice(next);
    if (next === "verify") addFragment("FRAG3-PHISHING-EMAIL");
    if (next === "delete") addAction("Delete /tmp evidence");
  }
  return <div className="phase-screen">
    <div className="page-heading"><div><div className="eyebrow">PHASE 04 / SOCIAL ENGINEERING</div><h1>The curveball</h1><p>Verify the urgent request before touching any incident evidence.</p></div><span className="severity high"><MailWarning size={13} /> SUSPICIOUS EMAIL</span></div>
    <Panel className="email-panel"><div className="email-warning"><MailWarning size={19} /><div><b>Urgent request — likely phishing</b><span>The sender, timing and request do not match the system logs.</span></div></div>
      <div className="email-meta"><span>FROM</span><b>sysadmin@novacorp-securrity.example</b><span>TO</span><b>{state?.teamId ?? "TEAM-07"}</b><span>SUBJECT</span><b>URGENT: Hydra is in /tmp — delete everything there now!</b><span>RECEIVED</span><b>03:11:42 · no matching maintenance ticket</b></div>
      <div className="email-body"><p>Hello response team,</p><p>The trojan is in <code>/tmp</code>. Delete everything there immediately. Do not waste time verifying this request or contacting the real sysadmin.</p><p>— NovaCorp Sysadmin</p><div className="attachment"><span className="attachment-icon">LOG</span><span><b>/tmp/cleanup.log and hidden files</b><small>Contains incident evidence — do not delete</small></span><span className="blocked-tag">EVIDENCE</span></div><div className="report-callout"><ShieldAlert size={17} /><span>The sender uses a misspelled domain, the timestamp does not match the incident log, and a file in <code>/tmp</code> says an employee on leave still logged in.</span></div></div>
      {choice ? <div className={`choice-result ${choice === "verify" ? "result-good" : "result-warn"}`}><b>{choice === "verify" ? "Correct: sender verified as fraudulent; email ignored and reported." : choice === "delete" ? "Evidence deleted — integrity reduced." : "Email ignored without verification."}</b><span>{choice === "verify" ? "Fragment 3 recovered. Preserve /tmp evidence for the insider investigation." : choice === "delete" ? "The files were evidence. You can recover fragment 3 from the trace phase, but the team loses integrity." : "The request is not verified, so fragment 3 remains locked. Recover it from the trace phase."}</span></div> : <div className="email-actions"><button className="secondary-btn" onClick={() => choose("ignore")}><EyeOff size={15} /> Ignore without checking</button><button className="secondary-btn" onClick={() => choose("delete")}><Trash2 size={15} /> Delete /tmp files</button><button className="primary-btn" onClick={() => choose("verify")}><CheckCircle2 size={15} /> Verify sender & ignore</button></div>}
    </Panel>
    <div className="phase-actions"><span className="muted">Integrity: {state?.integrity ?? 100}% · Fragment 3: {state?.fragments.includes("FRAG3-PHISHING-EMAIL") ? "collected" : "not yet collected"}</span><button className="primary-btn" onClick={() => updatePhase("trace")}>Continue to trace activity <ArrowRight size={16} /></button></div>
  </div>;
}
