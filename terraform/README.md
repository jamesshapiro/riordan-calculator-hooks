# Independent backend for riordancalculator.com

Self-contained Terraform stack that stands up the public API, the
authenticated API, Lambda handlers, and the DynamoDB table powering
[riordancalculator.com](https://riordancalculator.com).

Replaces the shared `yar08qypp7.execute-api.us-east-1.amazonaws.com/dev/`
backend with one we fully control.

The frontend's existing Cognito user pool (`us-east-1_yhdxywO4A`) is **not**
managed here — it is referenced by ID and ARN only, so users keep their
accounts across the cutover.

## Layout

```
terraform/
├── provider.tf           AWS provider (profile = jamesshapiro)
├── backend.tf            Local state (S3 migration noted inline)
├── main.tf               Variables, locals, DynamoDB table, lambda zip
├── iam.tf                Lambda execution role + inline policy
├── lambda.tf             One aws_lambda_function per handler, x2 (public/auth)
├── api-public.tf         Public REST API gateway + usage plan + API key
├── api-auth.tf           Auth REST API gateway with Cognito authorizer
├── outputs.tf            URLs, table name, key, cognito IDs
├── deploy.sh             Build → apply → rewrite rc/.env.local
├── teardown.sh           terraform destroy
├── db_dump_restore.py    Scan-to-JSON + JSON-to-table tool
└── lambda/               Handler source (forked from riordan-discovery)
```

## Prerequisites

- `terraform` ≥ 1.5 (or `tofu`; set `TF_BIN=tofu` in your env)
- Python 3.10+ on PATH (used by deploy.sh to vendor Lambda deps via
  `python3 -m pip install --target …`)
- [`uv`](https://docs.astral.sh/uv/) for running `db_dump_restore.py`
  — boto3 is declared as an inline PEP 723 dependency in the script
  itself, so `uv run db_dump_restore.py …` auto-creates a venv with it
- AWS CLI configured with a `jamesshapiro` profile that can create
  IAM/Lambda/API Gateway/DynamoDB/CloudWatch resources
- Verified SES sender identity for `no-reply@riordancalculator.com`
  (out of scope here — needed for the `send_email` Lambda to actually send)

## Deploy

```bash
cd terraform/
./deploy.sh
```

What this does:

1. Copies `lambda/*.py` into `.build/lambda/` and `pip install`s the
   pure-Python runtime deps (`ulid-py`, `requests`, `beautifulsoup4`).
   numpy/pandas come from the AWS-published `AWSSDKPandas-Python312:6` layer.
2. `terraform init && terraform apply -auto-approve`.
3. Rewrites `rc/.env.local` with the new endpoints and Cognito IDs.

Useful flags:

- `./deploy.sh --plan` — print a plan and stop, no apply, no env write
- `./deploy.sh --skip-env` — apply but leave `rc/.env.local` alone

## Seed data from the existing prod table

After the first apply, copy data from the current prod DynamoDB table into
the new one with the dump/restore tool:

```bash
# 1. Dump prod
uv run db_dump_restore.py dump \
    --table <current-prod-table-name> \
    --out  prod-dump.json

# 2. Restore into the freshly applied table
uv run db_dump_restore.py restore \
    --table $(terraform output -raw dynamodb_table) \
    --in   prod-dump.json
```

(Pass `--profile <name>` to either subcommand if you need to override
the AWS credential session.)

`db_dump_restore.py dump` writes raw DynamoDB wire-format JSON, so
`restore` feeds it straight back to `BatchWriteItem` without conversion.

Restore refuses to write if the destination already has data; pass
`--overwrite` if you need to force it.

## Cutover and rollback

The current Amplify deploy reads these env vars:

- `NEXT_PUBLIC_MATRIX_URL`
- `NEXT_PUBLIC_MATRIX_URL_AUTH`
- `NEXT_PUBLIC_API_KEY`
- `NEXT_PUBLIC_AWS_USER_POOL_ID`
- `NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID`

To cut over:

1. Copy the deploy.sh-generated `rc/.env.local` values into the Amplify
   Console env vars for the production branch.
2. Trigger an Amplify rebuild.
3. Smoke test the live site.

To roll back: revert the three env vars in Amplify and rebuild. The old
`yar08qypp7.execute-api…` backend stays up and gets traffic again
immediately. Nothing in this stack touches it.

## State management

State currently lives in `terraform.tfstate` (local). When the stack is
stable, migrate to S3 — `backend.tf` has the exact commands inline.

## What is intentionally NOT here

- Custom API domain (`api.riordancalculator.com`). The
  `*.execute-api.amazonaws.com` URLs work fine; revisit post-launch.
- Cognito user pool — externally managed; referenced by ID only.
- Static site / CloudFront — Amplify already hosts `rc/`, no need to
  reimplement.
- CI/CD — `deploy.sh` from a developer machine is the v1 workflow.
- WAF / rate limiting.

## Notes on the Lambda source

`lambda/` is a soft-fork of `~/code/riordan-discovery/terraform/lambda/`,
which has the working handlers for the same DynamoDB schema. Two files
(`add_custom_sequence.py`, `unsubscribe_email.py`) were empty stubs in the
upstream; they have minimal `not_implemented` bodies here so the Lambda
functions deploy cleanly. Wire real logic in when the frontend starts
calling those routes.
