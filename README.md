# NovaCorp Incident Response Simulation

A demo-ready, interactive cybersecurity incident-response game frontend based on the uploaded DeepSeek planning conversation.

## Technology
- React 18 + Vite
- TypeScript
- Tailwind CSS 3 (configured) plus a custom stylesheet for the visual system
- Zustand for game/session state
- React Router for navigation
- Lucide React icons

## Run locally
1. Install Node.js 18 or 20 (LTS): https://nodejs.org/
2. Extract this folder.
3. Open a terminal inside `novacorp-incident-response`.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the URL printed by Vite, usually `http://localhost:5173`.

## Production build
```bash
npm run build
npm run preview
```

## Demo login
This is a frontend simulation using local mock data, not a production authentication system.
- Team ID: any value (or leave blank)
- Reconstruct the demo password from the pre-auth incident extract: employee ID `e1023` + incident date `17102026` (DDMMYYYY) + server `NCALPHA07` (remove punctuation). The normalized password is `e102317102026ncalpha07`.
- Select Analyst or Monitor role. During the investigation, the role-view switch lets a single-device demo compare both views. It does not synchronize separate devices; a real paired-team experience requires a backend.

## Story requirements implemented
- Incident report and password puzzle using employee ID, incident date, and affected server.
- Analyst filesystem and hidden-file evidence; click the 03:07 `ghost` login row to collect fragment 1.
- Monitor authentication records provide the answer for the vault and the scheduled-task note unlocks a later clue.
- Spoofed sysadmin email asks the team to delete `/tmp`; verifying it earns fragment 3, while deleting evidence reduces integrity and requires recovery.
- Process/network correlation separates Hydra's decoy process from the continuing `svc_backup` data stream; four fragments are required to run the kill-switch.
- False “SYSTEM SECURED” checkpoint, attacker reveal, three-minute crisis countdown, blocking the real exfiltration IP, disabling the hidden account and scheduled task, and naming insider `e4471` from the leave-roster clue.
- Full, partial, and failed outcomes are calculated in the debrief.

## Included flow
1. Incident briefing
2. Analyst / Monitor investigation console
3. Vault question and fragment collection
4. Suspicious email curveball
5. Trace process / network connection
6. System secured
7. Crisis countdown and response actions
8. Completion summary

The interface keeps the simulation local so it can be demonstrated before the backend is available. It does not connect to a real company network or perform real security actions.

## Backend integration notes
The frontend can later be connected to a backend using the API contract in `src/types/api.ts`. `vite.config.ts` proxies `/api` requests to `http://localhost:8000`. The current implementation deliberately uses local mock state so every screen works without backend endpoints.
