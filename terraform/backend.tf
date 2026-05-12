# Local state for v1. Migrate to S3 once the stack is stable:
#
#   1. Create state bucket + lock table once, e.g.:
#        aws s3api create-bucket --bucket rc-prod-tfstate-<account-id> --region us-east-1
#        aws s3api put-bucket-versioning --bucket rc-prod-tfstate-<account-id> \
#          --versioning-configuration Status=Enabled
#        aws dynamodb create-table --table-name rc-prod-tfstate-lock \
#          --attribute-definitions AttributeName=LockID,AttributeType=S \
#          --key-schema AttributeName=LockID,KeyType=HASH \
#          --billing-mode PAY_PER_REQUEST
#
#   2. Replace this block with:
#        terraform {
#          backend "s3" {
#            bucket         = "rc-prod-tfstate-<account-id>"
#            key            = "riordan-calculator/terraform.tfstate"
#            region         = "us-east-1"
#            dynamodb_table = "rc-prod-tfstate-lock"
#            encrypt        = true
#            profile        = "jamesshapiro"
#          }
#        }
#
#   3. terraform init -migrate-state

terraform {
  backend "local" {}
}
