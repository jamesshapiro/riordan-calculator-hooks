# Riordan Calculator

## Active Repos

### Frontend
- **Repo**: `/home/james/code/riordan-calculator-hooks`
- **Deployed to**: `riordancalculator.com` (S3 bucket `s3://riordancalculator.com` + CloudFront `E2JU45ZDYZG6SU`)
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

Built with [Next.js](https://nextjs.org/) static export and TypeScript.

```
npm install
npm run dev
npm run build
```

## Static architecture

- Routes are exported as static files with Next.js `output: 'export'`
- `trailingSlash: true` emits `/about/index.html`, `/papers/index.html`, `/history/index.html`, and `/sequences/index.html`
- AWS Amplify deploys the generated `out/` directory through the GitHub integration
- Share links use `/?id=<share-id>`

This setup fixes direct-refresh behavior for static routes like `riordancalculator.com/about`.

## Environment variables

Copy `.env.example` to `.env.local` for local development.

Required public runtime variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MATRIX_URL`
- `NEXT_PUBLIC_MATRIX_URL_AUTH`
- `NEXT_PUBLIC_API_KEY`

Optional auth variables:

- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`
- `NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID`

If the Cognito variables are omitted, the calculator still builds and the anonymous portions of the site work, but login/signup stays unavailable.

## Amplify deployment

Amplify should run the repository with the included `amplify.yml`:

- install dependencies with `npm ci`
- build with `npm run build`
- publish the `out/` directory
