# Riordan Calculator

## Architecture

Static Next.js (TypeScript) app deployed to AWS Amplify. All routes are pre-rendered as static HTML at build time, enabling direct URL access (e.g. `riordancalculator.com/about` persists on refresh).

### Routes

| Route | Page |
|-------|------|
| `/` | Home (calculator) |
| `/about` | About |
| `/papers` | Papers |
| `/sequences` | Sequence Editor |
| `/history` | Query History |

## Active Repos

### Frontend
- **Deployed to**: `riordancalculator.com` via AWS Amplify (Next.js integration)
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

Built with [Next.js](https://nextjs.org/) (static export).

```bash
npm install
npm run dev
npm run build   # outputs to ./out/
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_MATRIX_URL=https://yar08qypp7.execute-api.us-east-1.amazonaws.com/dev/
NEXT_PUBLIC_MATRIX_URL_AUTH=https://31mb8vbzh2.execute-api.us-east-1.amazonaws.com/dev/
NEXT_PUBLIC_API_KEY=your-api-key
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
```

## Deployment

Deployed via AWS Amplify's Next.js integration. Push to the connected branch triggers:
1. `npm install`
2. `next build` (generates static HTML in `out/`)
3. Amplify serves the static files with proper routing for all pages
