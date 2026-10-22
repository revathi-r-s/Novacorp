import { useState } from "react";
import { MessageSquare, Send, ShieldCheck } from "lucide-react";
import { useGame } from "../store/game";
import type { Role } from "../types/api";

export default function Chat() {
  const [draft, setDraft] = useState("");
  const messages = useGame((s) => s.messages);
  const addMessage = useGame((s) => s.addMessage);
  const role = useGame((s) => s.state?.role ?? "analyst");
  function send() {
    const text = draft.trim();
    if (!text) return;
    addMessage({
      id: crypto.randomUUID(),
      sender: role as Role,
      text,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    setDraft("");
  }
  return (
    <aside className="chat-panel">
      <div className="chat-head"><div className="icon-box"><MessageSquare size={17} /></div><div><b>Team channel</b><small><span className="live-dot" /> Encrypted simulation chat</small></div></div>
      <div className="chat-messages">
        {messages.map((m) => (
          <div className={`chat-message ${m.sender === role ? "mine" : ""}`} key={m.id}>
            <div className="chat-meta"><span>{m.sender === "system" ? "SYSTEM" : m.sender.toUpperCase()}</span><time>{m.at}</time></div>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <form className="chat-compose" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message your team…" aria-label="Message your team" />
        <button className="send-btn" aria-label="Send message"><Send size={16} /></button>
      </form>
      <div className="chat-footer"><ShieldCheck size={14} /> Training environment only</div>
    </aside>
  );
}
