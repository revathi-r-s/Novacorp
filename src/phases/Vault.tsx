import { useState } from "react";
import { ArrowRight, CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

export default function Vault() {
  const [answer, setAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const updatePhase = useGame((s) => s.updatePhase);
  const addFragment = useGame((s) => s.addFragment);
  const setFoundTaskClue = useGame((s) => s.setFoundTaskClue);
  const fragments = useGame((s) => s.state?.fragments ?? []);
  const correct = answer.trim().toLowerCase().includes("ghost") || answer.trim() === "203.0.113.9";
  function submit(e: React.FormEvent) {
    e.preventDefault(); setAttempted(true);
    if (correct) { addFragment("FRAG2-VAULT-KEY"); setFoundTaskClue(); updatePhase("curveball"); }
  }
  return <div className="phase-screen">
    <div className="page-heading"><div><div className="eyebrow">PHASE 03 / EVIDENCE VERIFICATION</div><h1>Evidence vault</h1><p>Answer the evidence question to unlock the next lead.</p></div><span className="severity medium"><LockKeyhole size={13} /> RESTRICTED</span></div>
    <div className="vault-layout"><div className="vault-visual"><div className="vault-orbit orbit-one" /><div className="vault-orbit orbit-two" /><div className="vault-core"><KeyRound size={44} /></div><span className="vault-code">VAULT / E-02</span><div className="vault-status"><span className="amber-dot" /> WAITING FOR VALIDATION</div></div>
      <Panel className="vault-question"><div className="vault-label"><LockKeyhole size={16} /> SECURITY CHALLENGE</div><h2>Which account logged in at 03:07 from the unknown IP?</h2><p className="muted">The Analyst can see this question but not the answer. Switch to the Monitor view in the previous phase and compare the 03:07 authentication record with your teammate.</p><form onSubmit={submit}><label>YOUR ANSWER</label><input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter username or IP address" autoFocus /><button className="primary-btn" type="submit">Validate evidence <ArrowRight size={16} /></button>{attempted && !correct && <div className="inline-error">Not quite. Recheck the flagged authentication event at 03:07.</div>}</form><div className="vault-hint"><span>MONITOR NOTE</span> The vault contains a second note: a scheduled task is configured to run “after cleanup.” Investigate it during the crisis.</div></Panel>
    </div>
    <div className="fragment-strip"><CheckCircle2 size={16} /><span><b>Fragments collected so far</b><small>{fragments.join(" · ") || "Inspect the unusual log entry first"}</small></span><span className="fragment-count">{fragments.length} / 4</span></div>
  </div>;
}
