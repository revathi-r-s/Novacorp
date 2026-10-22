import { useNavigate } from "react-router-dom";
import { CheckCircle2, RotateCcw, ShieldCheck, Trophy, AlertTriangle, XCircle } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

export default function Done() {
  const state = useGame((s) => s.state);
  const reset = useGame((s) => s.reset);
  const nav = useNavigate();
  const outcome = state?.outcome ?? (state?.timeExpired ? "failed" : "partial");
  const base = Math.min(100, Math.max(0, (state?.integrity ?? 0) + (state?.fragments.length ?? 0) * 2));
  const score = outcome === "full" ? Math.max(90, base) : outcome === "partial" ? Math.min(75, base) : Math.min(35, base);
  const heading = outcome === "full" ? "NOVA CORP SECURED" : outcome === "partial" ? "PARTIAL CONTAINMENT" : "DATA EXFILTRATION COMPLETE";
  const description = outcome === "full" ? "The upload was stopped, the scheduled task and hidden account were disabled, and the correct insider was identified." : outcome === "partial" ? "The team stopped the upload, but the insider identification or supporting evidence was incomplete. Review the clues to improve the score." : "The countdown expired before the incident was fully contained. The simulation records a major data-loss penalty.";
  return <div className="phase-screen done-screen">
    <div className="done-emblem">{outcome === "full" ? <Trophy size={35} /> : outcome === "partial" ? <AlertTriangle size={35} /> : <XCircle size={35} />}</div><div className="eyebrow centered">INCIDENT RESPONSE EXERCISE / DEBRIEF</div><h1 className="centered-title">{heading}</h1><p className="centered-subtitle">{description}</p>
    <div className="score-row"><div><span>TEAM SCORE</span><b>{score}<small>/100</small></b></div><div><span>FRAGMENTS</span><b>{state?.fragments.length ?? 0}<small> / 4</small></b></div><div><span>RESPONSE ACTIONS</span><b>{(state?.actions ?? []).filter((a) => a !== "Delete /tmp evidence").length}<small> completed</small></b></div></div>
    <Panel className="debrief-panel"><div className="panel-heading"><div><h3><ShieldCheck size={17} /> Response summary</h3><p>Session {state?.sessionId.slice(0, 8) ?? "DEMO"}</p></div><span className={`status-badge ${outcome === "full" ? "safe" : "danger"}`}>{outcome === "full" ? "FULL WIN" : outcome === "partial" ? "PARTIAL SCORE" : "FAILED"}</span></div>
      <div className="debrief-row"><CheckCircle2 size={16} /><span>Hydra decoy isolated: PID 4092 / ghost / 203.0.113.9:4444</span><b>{state?.hydraStopped ? "DONE" : "MISSED"}</b></div>
      <div className="debrief-row"><CheckCircle2 size={16} /><span>Exfiltration IP blocked: 198.51.100.24</span><b>{state?.actions.includes("Block exfiltration IP") ? "DONE" : "MISSED"}</b></div>
      <div className="debrief-row"><CheckCircle2 size={16} /><span>Hidden account svc_backup disabled</span><b>{state?.actions.includes("Disable hidden account svc_backup") ? "DONE" : "MISSED"}</b></div>
      <div className="debrief-row"><CheckCircle2 size={16} /><span>“After cleanup” scheduled task stopped</span><b>{state?.actions.includes("Stop after-cleanup task") ? "DONE" : "MISSED"}</b></div>
      <div className="debrief-row"><CheckCircle2 size={16} /><span>Insider selected: {state?.insider ?? "Not selected"} (correct identity: e4471)</span><b>{state?.insider === "e4471" ? "CORRECT" : "INCORRECT"}</b></div>
      <div className="debrief-row"><CheckCircle2 size={16} /><span>Planted clues found: hidden account {state?.foundHiddenAccount ? "✓" : "✗"}, leave roster {state?.foundLeaveClue ? "✓" : "✗"}, scheduled task {state?.foundTaskClue ? "✓" : "✗"}</span><b>{state?.foundHiddenAccount && state?.foundLeaveClue && state?.foundTaskClue ? "ALL FOUND" : "INCOMPLETE"}</b></div>
      {(state?.actions ?? []).includes("Delete /tmp evidence") && <div className="debrief-row"><AlertTriangle size={16} /><span>Team deleted /tmp evidence before verifying the phishing message; integrity penalty applied.</span><b>PENALTY</b></div>}
    </Panel>
    <div className="phase-actions"><span className="muted">Local mock simulation only — no real network or files were changed.</span><button className="primary-btn" onClick={() => { reset(); nav("/"); }}><RotateCcw size={16} /> Start a new simulation</button></div>
  </div>;
}
