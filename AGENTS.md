# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Riordan Calculator is a React 18 SPA bundled with Parcel 2.9.2. The backend is entirely remote AWS serverless (API Gateway + Lambda + DynamoDB + Cognito) — there is no backend code in this repo.

### Commands

See `package.json` scripts. Key ones:
- `npm run dev` — starts Parcel dev server (clears `.parcel-cache` and `dist` first via `predev`)
- `npm run build` — production build
- `npx eslint src/` — lint
- `npx prettier --check "src/**/*.js"` — format check

### Required local config files (both gitignored)

1. **`.env`** — must define `REACT_APP_MATRIX_URL`, `REACT_APP_MATRIX_URL_AUTH`, and `REACT_APP_API_KEY`. API endpoint URLs are documented in `README.md`.
2. **`src/aws-exports.js`** — Amplify/Cognito config. A placeholder with dummy `userPoolId` and `userPoolClientId` is sufficient to start the dev server; auth features will fail gracefully without real values.

### Gotchas

- The `predev` script (`rimraf .parcel-cache dist`) runs before `npm run dev`, so cold starts take a few extra seconds.
- ESLint uses `eslint-config-react-app` which triggers a deprecation warning about `@babel/plugin-proposal-private-property-in-object`. This is cosmetic and can be ignored.
- There are no automated tests configured in this repository.
- The `postbuild` script attempts to deploy to AWS S3/CloudFront. Use `npx parcel build public/index.html` directly if you only want a local build without deployment.
