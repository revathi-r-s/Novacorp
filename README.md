# NovaCorp Incident Response Simulation

An interactive cybersecurity incident-response game in which Analyst and Monitor teams investigate the Hydra Trojan, analyze logs and network activity, uncover a hidden insider threat, and stop data exfiltration before the countdown ends.

## Technology Stack

- React 18 + Vite
- TypeScript
- Tailwind CSS 3
- Zustand for game state
- React Router
- Lucide React icons

## Getting Started

### Prerequisites
Install Node.js from https://nodejs.org/.

### Run Locally

```bash
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Demo Login

This is a frontend simulation using local mock data, not a production authentication system.

- **Team ID:** Any value, or leave blank.
- **Password:** Reconstruct it using the incident clues shown on the login screen.
- **Role:** Choose Analyst or Monitor.

The app includes a role-view switch for comparing both views on one device. Separate-device synchronization requires a backend.

## Story and Gameplay

1. **Incident briefing:** Review NovaCorp's incident report and identify the login clues.
2. **Investigation console:** Explore files, hidden evidence, authentication records, and network logs.
3. **Vault challenge:** Investigate the suspicious 03:07 login and collect a kill-switch fragment.
4. **Email curveball:** Verify the suspicious sysadmin email instead of blindly deleting evidence.
5. **Process and network tracing:** Distinguish Hydra's decoy process from the real data-exfiltration activity.
6. **False victory:** Assemble the fragments and trigger the apparent system recovery.
7. **Crisis response:** Block the exfiltration IP, disable the hidden account and scheduled task, and identify the insider.
8. **Debrief:** Review the final outcome based on the team's actions.

The simulation includes full, partial, and failed outcomes depending on the investigation and response decisions.

## Backend Integration

The frontend currently uses local mock state and does not connect to a real company network or execute real security actions.

The API contract is documented in `src/types/api.ts`. The Vite configuration can proxy `/api` requests to a backend running at `http://localhost:8000`.

## License

Add a license if you intend to distribute this project publicly.
