import boto3
import json

TABLE_NAME = "riordan-calc-auth_api"
names_path = "names"
stripped_path = "stripped"

def load_names(path):
    d = {}
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line or line.startswith('#') or line.strip() == '':
                continue
            if not line.startswith('A'):
                continue
            parts = line.rstrip('\n').split(' ', 1)
            if len(parts) != 2:
                continue
            seq_id, name = parts
            d[seq_id] = name.strip()
    return d

def load_numbers(path):
    d = {}
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line or line.startswith('#') or line.strip() == '':
                continue
            if not line.startswith('A'):
                continue
            line = line.rstrip('\n')
            seq_id, rest = line.split(' ', 1)
            nums_part = rest.strip()
            if nums_part.startswith(','):
                nums_part = nums_part[1:]
            if nums_part.endswith(','):
                nums_part = nums_part[:-1]
            if not nums_part:
                nums = []
            else:
                raw = nums_part.split(',')
                nums = [int(x) for x in raw if x.strip() != '']
            d[seq_id] = nums
    return d

def main():
    names = load_names(names_path)
    numbers = load_numbers(stripped_path)
    client = boto3.client("dynamodb")
    common_ids = sorted(set(name.keys()) & set(numbers.keys()))
    count = 1
    for seq_id in common_ids:
        name = names[seq_id]
        nums = numbers[seq_id]
        item = {
            "PK1": {"S": f"OEIS_SEQUENCE#{seq_id}"},
            "SK1": {"S": f"OEIS_SEQUENCE#{seq_id}"},
            "NAME": {"S": name},
            "NUMBERS": {"S": json.dumps(nums)}
        }
        client.put_item(TableName=TABLE_NAME, Item=item)
        print(seq_id)
        count += 1

if __name__ == "__main__":
    main()
