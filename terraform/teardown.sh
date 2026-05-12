#!/usr/bin/env bash
set -euo pipefail

# Tear down the independent backend.
# Runs from the terraform/ directory.
#
# This destroys everything terraform manages in this directory: both API
# Gateways, all Lambda functions, the DynamoDB table, the IAM role, and
# CloudWatch log groups. It does NOT touch the Cognito user pool (that's
# externally managed).

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

TF_BIN="${TF_BIN:-terraform}"
command -v "$TF_BIN" >/dev/null 2>&1 || { echo "$TF_BIN not on PATH"; exit 1; }

"$TF_BIN" init -input=false
"$TF_BIN" destroy -auto-approve

rm -rf .build
echo "Teardown complete. Cognito pool (externally managed) is untouched."
