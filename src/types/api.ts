export type Role = "analyst" | "monitor";
export type Phase = "briefing" | "explore" | "vault" | "curveball" | "trace" | "secured" | "crisis" | "done";
export type Outcome = "full" | "partial" | "failed";

export interface GameState {
  sessionId: string;
  teamId: string;
  role: Role;
  phase: Phase;
  fragments: string[];
  integrity: number;
  endsAt?: string;
  actions: string[];
  insider?: string;
  inspectedLog: boolean;
  foundLeaveClue: boolean;
  foundHiddenAccount: boolean;
  foundTaskClue: boolean;
  emailChoice?: "verify" | "ignore" | "delete";
  hydraStopped: boolean;
  outcome?: Outcome;
  timeExpired: boolean;
}

export interface ChatMessage {
  id: string;
  sender: Role | "system";
  text: string;
  at: string;
}
