import { useEffect, useRef, useState } from "react";
import { AlertOctagon, ArrowRight, CheckCircle2, Clock3, LockKeyhole, Network, ShieldAlert, UserRound, Zap, FolderSearch } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

const duration = 180;
const REQUIRED_ACTIONS = ["Block exfiltration IP", "Disable hidden account svc_backup", "Stop after-cleanup task"];
export default function Crisis() {
  const state = useGame((s) => s.state);
  const addAction = useGame((s) => s.addAction);
  const setInsider = useGame((s) => s.setInsider);
  const updatePhase = useGame((s) => s.updatePhase);
  const setFoundLeaveClue = useGame((s) => s.setFoundLeaveClue);
  const setFoundTaskClue = useGame((s) => s.setFoundTaskClue);
  const setFoundHiddenAccount = useGame((s) => s.setFoundHiddenAccount);
  const setTimeExpired = useGame((s) => s.setTimeExpired);
  const setOutcome = useGame((s) => s.setOutcome);
  const [seconds, setSeconds] = useState(duration);
  const [insiderChoice, setInsiderChoice] = useState("");
  const [archiveOpened, setArchiveOpened] = useState(false);
  const penaltyRef = useRef(0);
  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, duration - Math.floor((Date.now() - start) / 1000) - penaltyRef.current);
      setSeconds(remaining);
      if (remaining === 0) setTimeExpired();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [setTimeExpired]);
  const actions = state?.actions ?? [];
  const actionsComplete = REQUIRED_ACTIONS.every((a) => actions.includes(a));
  const cluesComplete = !!state?.foundHiddenAccount && !!state?.foundTaskClue && !!state?.foundLeaveClue;
  const canFinish = actionsComplete && !!state?.insider;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = Math.min(100, Math.round((duration - seconds) / duration * 100));
  function finish() {
    let outcome: "full" | "partial" | "failed";
    if (seconds === 0 || state?.timeExpired || !actionsComplete) outcome = "failed";
    else if (state?.insider === "e4471" && cluesComplete && (state?.integrity ?? 0) >= 60) outcome = "full";
    else outcome = "partial";
    setOutcome(outcome);
    updatePhase("done");
  }
  function reopenArchive() {
    setArchiveOpened(true);
    setFoundHiddenAccount(); setFoundTaskClue(); setFoundLeaveClue();
    penaltyRef.current += 25;
    setSeconds((s) => Math.max(0, s - 25));
  }
  return <div className="phase-screen crisis-screen">
    <div className="page-heading"><div><div className="eyebrow red-eyebrow">PHASE 07 / ACTIVE INCIDENT</div><h1>THE CRISIS</h1><p>Hydra was a decoy. The insider's upload is headed to <code>198.51.100.24</code>. The Monitor and Analyst must coordinate now.</p></div><span className="severity critical"><AlertOctagon size={13} /> CRITICAL</span></div>
    <div className="crisis-hero"><div><div className="countdown-label"><Clock3 size={15} /> TIME UNTIL DATA UPLOAD COMPLETES</div><div className={`countdown ${seconds < 45 ? "countdown-red" : ""}`}>{mm}<span>:</span>{ss}</div><p>{seconds === 0 ? "UPLOAD COMPLETED — heavy incident penalty" : "Stop the transfer before time expires"}</p></div><div className="countdown-right"><span>RESPONSE WINDOW</span><b>03:00 MIN</b><div className="countdown-track"><span style={{ width: `${100 - progress}%` }} /></div><small>{seconds === 0 ? "Time expired" : `${seconds} seconds remaining`}</small></div></div>
    <div className="section-heading"><h3>Containment checklist</h3><span>{REQUIRED_ACTIONS.filter((a) => actions.includes(a)).length} of 3 actions complete</span></div>
    <div className="crisis-actions-grid">
      <div className={`crisis-action-card ${actions.includes(REQUIRED_ACTIONS[0]) ? "action-complete" : ""}`}><div className="crisis-action-icon"><Network size={18} /></div><div><b>Monitor: block exfiltration IP</b><p>Block destination 198.51.100.24, not Hydra's old IP.</p></div>{actions.includes(REQUIRED_ACTIONS[0]) ? <CheckCircle2 className="green-text" size={19} /> : <button className="mini-action" disabled={seconds === 0} onClick={() => addAction(REQUIRED_ACTIONS[0])}>Block IP</button>}</div>
      <div className={`crisis-action-card ${actions.includes(REQUIRED_ACTIONS[1]) ? "action-complete" : ""}`}><div className="crisis-action-icon"><UserRound size={18} /></div><div><b>Analyst: disable hidden account</b><p>Disable svc_backup, the unlisted local account.</p></div>{actions.includes(REQUIRED_ACTIONS[1]) ? <CheckCircle2 className="green-text" size={19} /> : <button className="mini-action" disabled={seconds === 0} onClick={() => addAction(REQUIRED_ACTIONS[1])}>Disable account</button>}</div>
      <div className={`crisis-action-card ${actions.includes(REQUIRED_ACTIONS[2]) ? "action-complete" : ""}`}><div className="crisis-action-icon"><Zap size={18} /></div><div><b>Analyst: stop scheduled task</b><p>Disable the task that runs “after cleanup.”</p></div>{actions.includes(REQUIRED_ACTIONS[2]) ? <CheckCircle2 className="green-text" size={19} /> : <button className="mini-action" disabled={seconds === 0} onClick={() => addAction(REQUIRED_ACTIONS[2])}>Stop task</button>}</div>
    </div>
    <Panel className="insider-panel"><div className="insider-symbol"><LockKeyhole size={19} /></div><div className="insider-copy"><b>Name the insider</b><p>The hidden account is a tool, not the employee's identity. Who was on leave but still logged in?</p></div><select value={insiderChoice} disabled={seconds === 0} onChange={(e) => { setInsiderChoice(e.target.value); if (e.target.value) setInsider(e.target.value); }}><option value="">Select employee…</option><option value="e1023">e1023 — online employee</option><option value="e4471">e4471 — marked on leave</option><option value="e8802">e8802 — online employee</option><option value="ghost">ghost — Hydra decoy account</option></select>{state?.insider && <span className={`status-badge ${state.insider === "e4471" ? "safe" : "danger"}`}>{state.insider === "e4471" ? "LIKELY MATCH" : "CHECK EVIDENCE"}</span>}</Panel>
    <Panel className="contain-panel"><div className="contain-icon"><FolderSearch size={19} /></div><div className="contain-copy"><b>{archiveOpened ? "Evidence archive reviewed" : "Missing clues? Reopen the evidence archive"}</b><p>{cluesComplete ? "All planted clues are recorded: hidden account, after-cleanup task, and employee-on-leave login." : "Reviewing the earlier files costs 25 seconds. It reveals the hidden account, scheduled task and leave-roster clues."}</p></div>{cluesComplete ? <span className="status-badge safe">CLUES FOUND</span> : <button className="secondary-btn" disabled={archiveOpened || seconds === 0} onClick={reopenArchive}>Review evidence (−25s)</button>}</Panel>
    {seconds === 0 ? <div className="crisis-note"><ShieldAlert size={15} /> Time ran out. The simulated upload completed; finish the debrief to see the failed outcome.</div> : canFinish ? <div className="crisis-finished"><CheckCircle2 size={19} /><div><b>Containment actions recorded</b><span>{cluesComplete && state?.insider === "e4471" ? "Evidence supports a full-win result." : "Your response may receive a partial score. Check the clues and insider identity."}</span></div><button className="primary-btn" onClick={finish}>Stop upload & debrief <ArrowRight size={15} /></button></div> : <div className="crisis-note"><ShieldAlert size={15} /> Complete all three actions and name the insider before the timer reaches zero.</div>}
    {seconds === 0 && <div className="phase-actions"><span className="muted">The upload timer has expired.</span><button className="primary-btn" onClick={finish}>View incident outcome <ArrowRight size={15} /></button></div>}
  </div>;
}
