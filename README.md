# Riordan Calculator

## Active Repos

### Frontend
- **Repo**: `/home/james/code/riordan-calculator-hooks`
- **Framework**: Next.js + TypeScript (static export)
- **Deployed to**: `riordancalculator.com` via GitHub -> AWS Amplify (Next.js integration)
- **API endpoints** (in `.env`):
  - Unauthenticated: `https://yar08qypp7.execute-api.us-east-1.amazonaws.com/dev/`
  - Authenticated: `https://31mb8vbzh2.execute-api.us-east-1.amazonaws.com/dev/`

### Backend (API + Lambda)
- **Repo**: `/home/james/code/terragrunt-infrastructure-live`
- **Terragrunt configs**:
  - `jamesshapiro/us-east-1/default/riordan-api/terragrunt.hcl` (unauthenticated)
  - `jamesshapiro/us-east-1/default/riordan-api-auth/terragrunt.hcl` (authenticated, Cognito)
- **Lambda source code**: `jamesshapiro/us-east-1/default/riordan-api/lambda_function/`
- **Deployed lambda package**: Both APIs share the same S3 artifact at `s3://athens-build-lambda-code/riordan-calc/archive.zip`
- **Runtime**: Python 3.12, 2GB RAM, 150s timeout

#### API Endpoints

| Resource | riordan-api | riordan-api-auth |
|----------|:-----------:|:----------------:|
| `PUT /queries` (calculate_matrix) | x | x |
| `GET /queries` (get_queries) | x | x |
| `GET /stats` (get_stats) | x | x |
| `GET /query` (get_query) | | x |
| `PUT /query` (put_query_metadata) | | x |
| `DELETE /query` (delete_query) | | x |
| `GET /email` (send_email) | | x |
| `PUT /email` (unsubscribe_email) | | x |
| `GET /oeis` (fetch_oeis_sequence) | | x |
| `GET /sequence` (get_sequences) | | x |
| `PUT /sequence` (put_sequences) | | x |
| `DELETE /sequence` (delete_sequence) | | x |
| `PUT /preset` (update_preset) | | x |

## Development

Built with [Next.js](https://nextjs.org/) and TypeScript.

```
npm install
npm run dev
npm run build
```

## Static routing and deployment

- Static export is enabled with `output: 'export'`.
- `trailingSlash: true` is enabled so each route exports as `route/index.html`.
- Deep links like `riordancalculator.com/about` and refreshes on static hosting resolve to the prebuilt page.

## Environment variables

Set these for local/dev/prod:

- `NEXT_PUBLIC_MATRIX_URL`
- `NEXT_PUBLIC_MATRIX_URL_AUTH`
- `NEXT_PUBLIC_API_KEY`
- `NEXT_PUBLIC_AWS_USER_POOL_ID`
- `NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID`
- `NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID`
