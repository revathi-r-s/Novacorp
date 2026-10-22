import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";
import Panel from "../components/Panel";
import { useGame } from "../store/game";

export default function Secured() {
  const updatePhase = useGame((s) => s.updatePhase);
  const state = useGame((s) => s.state);
  return <div className="phase-screen secured-screen">
    <div className="secured-glow" />
    <div className="success-emblem"><ShieldCheck size={46} /></div>
    <div className="eyebrow centered">KILL-SWITCH EXECUTED / CHECKPOINT PASSED</div>
    <h1 className="centered-title">SYSTEM SECURED</h1>
    <p className="centered-subtitle">Hydra's visible payload has stopped. The team appears to have won — but the Monitor still sees a small, steady outbound data stream.</p>
    <Panel className="secured-summary"><div><CheckCircle2 size={17} /><span><b>Hydra decoy identified</b><small>ghost · 03:07 UTC · 203.0.113.9:4444</small></span><span className="summary-done">DONE</span></div><div><CheckCircle2 size={17} /><span><b>Four kill-switch fragments assembled</b><small>{state?.fragments.length ?? 0} fragments recovered</small></span><span className="summary-done">DONE</span></div><div><AlertTriangle size={17} color="#f6bd60" /><span><b>Unexplained data transfer continues</b><small>svc_backup → 198.51.100.24:8443</small></span><span className="severity critical">ACTIVE</span></div></Panel>
    <div className="crisis-intro"><Sparkles size={18} /><span><b>ATTACKER MESSAGE: “Thanks for killing Hydra. You just gave me the time I needed.”</b><small>Hydra was a decoy. A hidden insider account has been copying NovaCorp data. Stop the upload before the countdown reaches zero.</small></span><button className="primary-btn" onClick={() => updatePhase("crisis")}>Enter crisis <ArrowRight size={15} /></button></div>
    <p className="muted centered">This is a fictional incident-response exercise. No real host has been changed.</p>
  </div>;
}
