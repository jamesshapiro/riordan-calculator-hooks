#!/usr/bin/env bash
set -euo pipefail

# Independent backend deploy for riordan-calculator.
# Runs from the terraform/ directory.
#
# Steps:
#   1. Package Lambda handlers (.build/lambda)
#   2. terraform init + apply
#   3. Write rc/.env.local with the new API endpoints
#
# Usage:
#   ./deploy.sh                — build, apply, rewrite rc/.env.local
#   ./deploy.sh --skip-env     — apply only; do not touch rc/.env.local
#   ./deploy.sh --plan         — terraform plan only (no apply, no env write)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

red()    { printf "\033[31m%s\033[0m\n" "$*"; }
green()  { printf "\033[32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }

SKIP_ENV=false
PLAN_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --skip-env) SKIP_ENV=true ;;
    --plan)     PLAN_ONLY=true ;;
    *)
      red "Unknown flag: $arg"
      exit 1
      ;;
  esac
done

TF_BIN="${TF_BIN:-terraform}"
command -v "$TF_BIN" >/dev/null 2>&1 || { red "$TF_BIN not on PATH"; exit 1; }

# Prefer `python3 -m pip` over a `pip` binary — the latter isn't always on PATH
# (e.g. on Homebrew/Linuxbrew installs).
PYTHON_BIN="${PYTHON_BIN:-python3}"
command -v "$PYTHON_BIN" >/dev/null 2>&1 || { red "$PYTHON_BIN not on PATH"; exit 1; }
"$PYTHON_BIN" -m pip --version >/dev/null 2>&1 || { red "pip not available via $PYTHON_BIN -m pip"; exit 1; }

# ---------------------------------------------------------------------------
# Step 1: Build Lambda package
# ---------------------------------------------------------------------------
echo "=== Step 1: Building Lambda package ==="
rm -rf .build/lambda
mkdir -p .build/lambda

cp lambda/*.py .build/lambda/
green "Copied $(ls .build/lambda/*.py | wc -l) handler files"

# Vendor pure-Python deps (numpy/pandas come from the AWSSDKPandas layer)
"$PYTHON_BIN" -m pip install --quiet --target .build/lambda ulid-py requests beautifulsoup4 2>&1 | tail -3
green "Vendored runtime deps (ulid-py, requests, beautifulsoup4)"
echo ""

# ---------------------------------------------------------------------------
# Step 2: terraform init + plan/apply
# ---------------------------------------------------------------------------
echo "=== Step 2: Terraform ==="
"$TF_BIN" init -input=false

if [ "$PLAN_ONLY" = true ]; then
  "$TF_BIN" plan
  green "Plan complete (no apply)"
  exit 0
fi

"$TF_BIN" apply -auto-approve
echo ""

# ---------------------------------------------------------------------------
# Step 3: Write rc/.env.local
# ---------------------------------------------------------------------------
if [ "$SKIP_ENV" = true ]; then
  yellow "Skipping rc/.env.local rewrite (--skip-env)"
  exit 0
fi

echo "=== Step 3: Writing rc/.env.local ==="
PUBLIC_API_URL=$("$TF_BIN" output -raw public_api_url)
AUTH_API_URL=$("$TF_BIN" output -raw auth_api_url)
PUBLIC_API_KEY=$("$TF_BIN" output -raw public_api_key)
COGNITO_POOL_ID=$("$TF_BIN" output -raw cognito_user_pool_id)
COGNITO_CLIENT_ID=$("$TF_BIN" output -raw cognito_user_pool_client_id)

cat > "$SCRIPT_DIR/../rc/.env.local" << EOF
NEXT_PUBLIC_MATRIX_URL=${PUBLIC_API_URL}
NEXT_PUBLIC_MATRIX_URL_AUTH=${AUTH_API_URL}
NEXT_PUBLIC_API_KEY=${PUBLIC_API_KEY}
NEXT_PUBLIC_AWS_USER_POOL_ID=${COGNITO_POOL_ID}
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=${COGNITO_CLIENT_ID}
EOF
green "Wrote rc/.env.local"
echo ""

echo "=========================================="
green "Deploy complete."
echo ""
echo "Public API:  ${PUBLIC_API_URL}"
echo "Auth API:    ${AUTH_API_URL}"
echo ""
echo "Next: copy these into Amplify Console env vars and trigger a rebuild,"
echo "or run \`bun dev\` in rc/ to test against the new backend locally."
echo "=========================================="
