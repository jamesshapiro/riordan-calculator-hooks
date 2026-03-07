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

Built with [Next.js](https://nextjs.org/) and exported as a static site for AWS Amplify hosting.

```
npm install
npm run dev
npm run build
```

## Deployment

The site is configured as a static Next.js export.

- Static routes are generated for `/`, `/about`, `/papers`, `/sequences`, and `/history`
- `npm run build` emits the deployable static site through Next.js export output
- AWS Amplify can deploy the repo directly from GitHub using the Next.js integration

## Environment Variables

Client-side API and auth configuration now use public Next.js environment variables:

- `NEXT_PUBLIC_MATRIX_URL`
- `NEXT_PUBLIC_MATRIX_URL_AUTH`
- `NEXT_PUBLIC_API_KEY`
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`
- `NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID`
