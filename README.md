# Market-Message-Generator

Market-Message-Generator helps marketers turn a single campaign brief into platform-ready social posts. The project bundles a lightweight Node API with a React (Vite) client so you can generate, edit, and export drafts for Instagram, Facebook, and X.

## Key Features
- **LLM-powered generation**: Compose platform-ready copy via OpenAI-compatible chat completions; if the model is unreachable, the server falls back to deterministic house templates so work never stops.
- **Platform-aware validation**: Character limits, handle/hashtag formats, and link rules are enforced on both the server and the UI with shared logic, keeping drafts compliant across Instagram, Facebook, and X.
- **Focused editing workflow**: React editors offer autosave, per-platform copy/export, helper buttons for hashtags and mentions, and surrogate-aware character counts that stay in sync with backend validation.
- **Import/Export lifecycle**: Download a JSON bundle of drafts, re-import it later, or share with teammates to continue refining the campaign without losing context.

## UI Inputs
| Input | Description | Required |
| --- | --- | --- |
| Objective | Core campaign goal shown at the start of every generated post. | Yes |
| Audience | Optional segment or persona used to tailor tone in LLM prompts. | No |
| Key messages | Newline-separated points; each line feeds into the generation context. | No (but recommended) |
| Call to action | Closing CTA appended to every draft. | Yes |
| Tone preset | Friendly, Professional, or Witty tone selector affecting the API payload. | Yes |
| Platforms | Instagram, Facebook, X checkboxes; determines which drafts/validators run. | Yes (at least one) |
| Draft editor panes | Per-platform textareas with live counts, helper buttons, copy/export, and JSON import. | N/A |

## Prerequisites
- Node.js 18+
- npm 9+

## Installation
```bash
npm install
```
Or run the convenience script:
```bash
./scripts/install
```

## Environment Configuration
Copy `.env.example` to `.env.local` (ignored by git) and adjust values:
```
PORT=3100
OPENAI_API_BASE=https://api.openai-compatible.example/v1
OPENAI_API_KEY=sk-REPLACE_ME
LLM_MODEL=gpt-4o-mini
VITE_UI_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3100
```
To use an Azure OpenAI deployment, set `OPENAI_API_BASE` to the deployment root without `/chat/completions` (e.g. `https://<resource>.cognitiveservices.azure.com/openai/deployments/<deployment>?api-version=2024-12-01-preview`). The backend appends `/chat/completions` and preserves query strings automatically.

## Running Locally
Start the API (loads `.env.local` automatically):
```bash
set -a && source .env.local && set +a
./scripts/run api
```
In another shell, launch the UI:
```bash
npm run dev
```
- API defaults to `http://localhost:3100`
- UI defaults to `http://localhost:5173`

## Smoke Test the Generator API
With the API running and LLM credentials configured:
```bash
curl -sS -X POST http://localhost:3100/api/generate \
  -H 'Content-Type: application/json' \
  -d '{
        "brief": {
          "objective": "Launch beta waitlist",
          "messages": ["Join early access", "Share feedback"],
          "cta": "Sign up today"
        },
        "platforms": ["instagram", "x"],
        "tone": "friendly"
      }' | jq
```
If the LLM call fails (auth/path), the response falls back to a deterministic stub and the API logs the warning.

## Scripts
- `./scripts/run [api|ui]` – start the API (default) or Vite dev server (`ui`).
- `./scripts/test` – execute Node unit suites and the Vitest UI suite.
- `npm run dev` – run the Vite dev server directly.
- `npm run build` – build the production bundle.
- `npm run lint` – lint UI sources with ESLint.

## Testing
Unit and UI suites use Vitest. Run with coverage:
```bash
CI=true npm run test -- --coverage
```
Coverage targets (from project policy): statements ≥ 80%, branches ≥ 80% preferred. Recent runs sit around 92% statements.

## Project Structure
```
src/
├── server.js          # Node HTTP entrypoint
├── handler.js         # API routing logic
├── generator.js       # Calls OpenAI-compatible LLM + fallback
├── llm.js             # Prompt construction + fetch helper
├── storage.js         # In-memory draft persistence
├── validation.js      # Platform-specific validation
└── ui/                # React application (App.jsx, components, styles)

tests/
├── unit/              # Node-side tests (API, generator, templates)
└── ui/                # Vitest + Testing Library UI suites
scripts/               # install, run, lint, build, test helpers
```

## Contributing
- Keep PRs small and run `./scripts/test` before submitting.
- Update `.env.example` placeholders if configuration changes.
- Follow the surrogate-aware counting approach (`Array.from`) when working with character limits.

## License
ISC
