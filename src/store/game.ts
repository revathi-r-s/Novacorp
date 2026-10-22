import { create } from "zustand";
import type { ChatMessage, GameState, Phase, Role, Outcome } from "../types/api";

interface GameStore {
  state: GameState | null;
  messages: ChatMessage[];
  setState: (s: GameState) => void;
  updatePhase: (phase: Phase) => void;
  addFragment: (fragment: string) => void;
  addAction: (action: string) => void;
  setInsider: (name: string) => void;
  setRole: (role: Role) => void;
  setInspectedLog: () => void;
  setFoundLeaveClue: () => void;
  setFoundHiddenAccount: () => void;
  setFoundTaskClue: () => void;
  setEmailChoice: (choice: "verify" | "ignore" | "delete") => void;
  setHydraStopped: () => void;
  setOutcome: (outcome: Outcome) => void;
  setTimeExpired: () => void;
  addMessage: (message: ChatMessage) => void;
  reset: () => void;
}

const initialMessages: ChatMessage[] = [
  { id: "m1", sender: "system", text: "Secure channel established. Training simulation only. Analyst and Monitor must compare evidence.", at: "09:01" },
  { id: "m2", sender: "analyst", text: "I am checking the filesystem and authentication logs.", at: "09:02" },
  { id: "m3", sender: "monitor", text: "I can see unusual outbound traffic from NC-ALPHA-07. I will compare the destination and login records.", at: "09:03" }
];

export const useGame = create<GameStore>((set) => ({
  state: null,
  messages: initialMessages,
  setState: (state) => set({ state }),
  updatePhase: (phase) => set((s) => s.state ? { state: { ...s.state, phase } } : s),
  addFragment: (fragment) => set((s) => s.state && !s.state.fragments.includes(fragment)
    ? { state: { ...s.state, fragments: [...s.state.fragments, fragment] } } : s),
  addAction: (action) => set((s) => {
    if (!s.state || s.state.actions.includes(action)) return s;
    const penalty = action === "Delete /tmp evidence" ? 20 : 0;
    return { state: { ...s.state, actions: [...s.state.actions, action], integrity: Math.max(0, s.state.integrity - penalty) } };
  }),
  setInsider: (insider) => set((s) => s.state ? { state: { ...s.state, insider } } : s),
  setRole: (role) => set((s) => s.state ? { state: { ...s.state, role } } : s),
  setInspectedLog: () => set((s) => s.state ? { state: { ...s.state, inspectedLog: true } } : s),
  setFoundLeaveClue: () => set((s) => s.state ? { state: { ...s.state, foundLeaveClue: true } } : s),
  setFoundHiddenAccount: () => set((s) => s.state ? { state: { ...s.state, foundHiddenAccount: true } } : s),
  setFoundTaskClue: () => set((s) => s.state ? { state: { ...s.state, foundTaskClue: true } } : s),
  setEmailChoice: (emailChoice) => set((s) => s.state ? { state: { ...s.state, emailChoice } } : s),
  setHydraStopped: () => set((s) => s.state ? { state: { ...s.state, hydraStopped: true } } : s),
  setOutcome: (outcome) => set((s) => s.state ? { state: { ...s.state, outcome } } : s),
  setTimeExpired: () => set((s) => s.state ? { state: { ...s.state, timeExpired: true } } : s),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  reset: () => set({ state: null, messages: initialMessages })
}));
