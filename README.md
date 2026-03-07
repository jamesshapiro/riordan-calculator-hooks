# Riordan Calculator

## Active Repos

### Frontend
- **Repo**: `/home/james/code/riordan-calculator-hooks`
- **Deployed to**: `riordancalculator.com` (AWS Amplify, static Next.js export)
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

## Architecture

Built with [Next.js](https://nextjs.org/) (static export) + TypeScript. Deployed to AWS Amplify.

Static routes (`/about`, `/papers`, `/sequences`, `/history`) each produce their own HTML file via `output: 'export'`, so direct navigation and page refresh work without server-side routing.

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_MATRIX_URL` | Unauthenticated API base URL |
| `NEXT_PUBLIC_MATRIX_URL_AUTH` | Authenticated API base URL |
| `NEXT_PUBLIC_API_KEY` | API key for unauthenticated calls |

### AWS Amplify Auth

Place your `aws-exports.js` in `src/`. This file is gitignored.

## Development

```
npm install
npm run dev
npm run build
```

Build output is in the `out/` directory.
