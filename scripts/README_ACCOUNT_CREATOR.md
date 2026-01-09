# TZ-Cions Account Creator

Automatically create accounts on tz-cions.com

## Installation

```bash
pip install requests beautifulsoup4 faker
```

## Usage

### Method 1: Create Single Random Account

```bash
python tz_cions_account_creator.py
```

### Method 2: Create Multiple Accounts

```python
from tz_cions_account_creator import TZCionsAccountCreator

creator = TZCionsAccountCreator()

# Create 10 accounts
accounts = creator.create_multiple_accounts(count=10)
```

### Method 3: Create Account with Custom Credentials

```python
from tz_cions_account_creator import TZCionsAccountCreator

creator = TZCionsAccountCreator()

credentials = {
    'username': 'myusername',
    'password': 'MyPassword123',
    'email': 'email@example.com'
}

account = creator.create_account(credentials)
```

## Features

✅ Automatic account creation
✅ Random credential generation
✅ CSRF token handling
✅ Multiple account creation
✅ Credentials saved to file
✅ Account verification

## Output

All created accounts are saved to `tz_cions_accounts.txt`

## Warning

⚠️ Use responsibly and only for legitimate purposes
⚠️ Check website's Terms of Service
⚠️ Don't abuse the system

## Troubleshooting

**Error: Registration form not found**
- Website structure might have changed
- Check if registration is available

**Error: Account creation failed**
- Check internet connection
- Verify website is accessible
- Check if captcha is required

**Rate limiting**
- Script automatically waits 2 seconds between requests
- Increase delay if needed
