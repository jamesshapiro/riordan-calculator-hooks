# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 16 static-export frontend for [riordancalculator.com](https://riordancalculator.com). The backend (AWS Lambda + API Gateway) is in a separate repo and is not needed to run the frontend locally.

### Quick reference

- **Dev server:** `npm run dev` (port 3000)
- **Build:** `npm run build` (static export to `out/`)
- **Lint:** `npx eslint .` (0 errors expected; warnings are known/accepted)
- **Type check:** `npm run typecheck`

### Caveats

- The app computes Riordan matrices **client-side** when no API env vars are set. The Compute button works without a backend connection — the matrix result renders directly in the browser.
- Authenticated features (login, OEIS lookup, custom sequences, sharing) require `NEXT_PUBLIC_MATRIX_URL`, `NEXT_PUBLIC_API_KEY`, and Cognito env vars in `.env.local`. Without these, only the anonymous calculator flow works.
- `next.config.mjs` uses `output: 'export'` (static site generation). There is no SSR; `next start` won't serve the app in production mode — use `npx serve out` or similar after building.
- The `postinstall` script disables Next.js telemetry automatically.
