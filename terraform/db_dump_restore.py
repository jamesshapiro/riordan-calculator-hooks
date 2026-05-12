#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "boto3",
# ]
# ///
"""Dump a DynamoDB table to a JSON file and restore it into another table.

Uses boto3.client (low-level) so the dump file preserves the DynamoDB
wire format (e.g. {"PK1": {"S": "..."}}), which means restore can pipe items
straight back into BatchWriteItem with no type conversion.

Usage (uv handles the venv + boto3 install via inline PEP 723 metadata):

  # Scan source table into a JSON file
  uv run db_dump_restore.py dump \\
      --table <source-table> \\
      --out dump.json \\
      [--profile <aws-profile>]

  # Push a dump file into a destination table
  uv run db_dump_restore.py restore \\
      --table <destination-table> \\
      --in dump.json \\
      [--profile <aws-profile>] \\
      [--overwrite]

Restore is idempotent on PK1+SK1: PutItem with the same key overwrites.
By default restore refuses to run if the destination table already has data;
pass --overwrite to bypass that check.

End-to-end example for the cutover described in independent-backend-plan.md:

  uv run db_dump_restore.py dump    --table riordan-prod-data --out prod.json
  uv run db_dump_restore.py restore --table rc-prod-data      --in  prod.json
"""

import argparse
import json
import sys
import time

import boto3
from botocore.config import Config


BATCH_SIZE = 25  # DynamoDB BatchWriteItem hard limit


def make_client(profile: str | None):
    session = boto3.Session(profile_name=profile) if profile else boto3.Session()
    return session.client(
        "dynamodb",
        config=Config(retries={"max_attempts": 10, "mode": "adaptive"}),
    )


def dump(args: argparse.Namespace) -> int:
    client = make_client(args.profile)

    items: list[dict] = []
    scan_kwargs: dict = {"TableName": args.table}
    page = 0
    while True:
        response = client.scan(**scan_kwargs)
        items.extend(response.get("Items", []))
        page += 1
        print(
            f"  page {page}: scanned {len(response.get('Items', []))} "
            f"(total {len(items)})",
            file=sys.stderr,
        )
        last_key = response.get("LastEvaluatedKey")
        if not last_key:
            break
        scan_kwargs["ExclusiveStartKey"] = last_key

    with open(args.out, "w") as f:
        json.dump(items, f, indent=2)

    print(
        f"Dumped {len(items)} items from '{args.table}' to {args.out}",
        file=sys.stderr,
    )
    return 0


def restore(args: argparse.Namespace) -> int:
    client = make_client(args.profile)

    if not args.overwrite:
        probe = client.scan(TableName=args.table, Limit=1)
        if probe.get("Count", 0) > 0:
            print(
                f"Destination table '{args.table}' is not empty. "
                f"Pass --overwrite to write into it anyway.",
                file=sys.stderr,
            )
            return 1

    with open(args.input) as f:
        items = json.load(f)

    print(
        f"Restoring {len(items)} items into '{args.table}'...",
        file=sys.stderr,
    )

    written = 0
    for i in range(0, len(items), BATCH_SIZE):
        chunk = items[i : i + BATCH_SIZE]
        request_items = {
            args.table: [{"PutRequest": {"Item": item}} for item in chunk]
        }

        attempts = 0
        while request_items:
            response = client.batch_write_item(RequestItems=request_items)
            unprocessed = response.get("UnprocessedItems") or {}
            if not unprocessed:
                break
            attempts += 1
            if attempts > 8:
                print(
                    f"Giving up after 8 retries with "
                    f"{sum(len(v) for v in unprocessed.values())} unprocessed items",
                    file=sys.stderr,
                )
                return 2
            time.sleep(min(2 ** attempts * 0.1, 5))
            request_items = unprocessed

        written += len(chunk)
        print(f"  wrote {written}/{len(items)}", file=sys.stderr)

    print(
        f"Restored {written} items into '{args.table}'",
        file=sys.stderr,
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    subparsers = parser.add_subparsers(dest="cmd", required=True)

    p_dump = subparsers.add_parser("dump", help="Scan a table to JSON")
    p_dump.add_argument("--table", required=True, help="Source DynamoDB table name")
    p_dump.add_argument("--out", required=True, help="Output JSON file path")
    p_dump.add_argument("--profile", help="AWS CLI profile (optional)")
    p_dump.set_defaults(func=dump)

    p_restore = subparsers.add_parser("restore", help="Write a JSON dump into a table")
    p_restore.add_argument("--table", required=True, help="Destination DynamoDB table name")
    p_restore.add_argument("--in", dest="input", required=True, help="Input JSON file path")
    p_restore.add_argument("--profile", help="AWS CLI profile (optional)")
    p_restore.add_argument(
        "--overwrite",
        action="store_true",
        help="Write even if the destination table already has data",
    )
    p_restore.set_defaults(func=restore)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
