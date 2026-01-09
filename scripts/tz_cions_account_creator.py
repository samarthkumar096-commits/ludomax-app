"""
TZ-Cions Account Creator Bot
Automatically creates accounts on tz-cions.com
"""

import requests
from bs4 import BeautifulSoup
import random
import string
from faker import Faker

class TZCionsAccountCreator:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = "http://tz-cions.com"
        self.fake = Faker()
        
    def generate_random_credentials(self):
        """Generate random account credentials"""
        username = self.fake.user_name() + str(random.randint(1000, 9999))
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
        email = self.fake.email()
        
        return {
            'username': username,
            'password': password,
            'email': email,
            'first_name': self.fake.first_name(),
            'last_name': self.fake.last_name(),
            'phone': self.fake.phone_number()
        }
    
    def get_registration_page(self):
        """Get registration page and extract form details"""
        try:
            register_url = f"{self.base_url}/register"
            response = self.session.get(register_url)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find registration form
                form = soup.find('form')
                if not form:
                    print("❌ Registration form not found")
                    return None
                
                # Extract CSRF token if exists
                csrf_token = None
                csrf_input = form.find('input', {'name': '_token'})
                if csrf_input:
                    csrf_token = csrf_input.get('value')
                
                # Extract all form fields
                form_fields = {}
                for input_field in form.find_all('input'):
                    field_name = input_field.get('name')
                    if field_name:
                        form_fields[field_name] = input_field.get('type')
                
                return {
                    'csrf_token': csrf_token,
                    'form_fields': form_fields,
                    'action': form.get('action')
                }
            else:
                print(f"❌ Failed to load registration page. Status: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error getting registration page: {str(e)}")
            return None
    
    def create_account(self, credentials=None):
        """Create a new account"""
        try:
            # Get registration page details
            reg_details = self.get_registration_page()
            if not reg_details:
                return None
            
            # Generate credentials if not provided
            if not credentials:
                credentials = self.generate_random_credentials()
            
            # Prepare registration data
            register_data = {
                'username': credentials['username'],
                'password': credentials['password'],
                'email': credentials['email']
            }
            
            # Add CSRF token if exists
            if reg_details['csrf_token']:
                register_data['_token'] = reg_details['csrf_token']
            
            # Add additional fields based on form
            if 'first_name' in reg_details['form_fields']:
                register_data['first_name'] = credentials.get('first_name', '')
            if 'last_name' in reg_details['form_fields']:
                register_data['last_name'] = credentials.get('last_name', '')
            if 'phone' in reg_details['form_fields']:
                register_data['phone'] = credentials.get('phone', '')
            if 'password_confirmation' in reg_details['form_fields']:
                register_data['password_confirmation'] = credentials['password']
            
            # Submit registration
            register_url = f"{self.base_url}/register"
            if reg_details['action']:
                register_url = f"{self.base_url}{reg_details['action']}"
            
            response = self.session.post(register_url, data=register_data)
            
            if response.status_code == 200 or response.status_code == 302:
                print("✅ Account created successfully!")
                print(f"Username: {credentials['username']}")
                print(f"Password: {credentials['password']}")
                print(f"Email: {credentials['email']}")
                
                # Save credentials to file
                self.save_credentials(credentials)
                
                return credentials
            else:
                print(f"❌ Account creation failed. Status: {response.status_code}")
                print(f"Response: {response.text[:500]}")
                return None
                
        except Exception as e:
            print(f"❌ Error creating account: {str(e)}")
            return None
    
    def save_credentials(self, credentials):
        """Save credentials to file"""
        try:
            with open('tz_cions_accounts.txt', 'a') as f:
                f.write(f"\n{'='*50}\n")
                f.write(f"Username: {credentials['username']}\n")
                f.write(f"Password: {credentials['password']}\n")
                f.write(f"Email: {credentials['email']}\n")
                f.write(f"{'='*50}\n")
            print("✅ Credentials saved to tz_cions_accounts.txt")
        except Exception as e:
            print(f"❌ Error saving credentials: {str(e)}")
    
    def create_multiple_accounts(self, count=5):
        """Create multiple accounts"""
        print(f"🚀 Creating {count} accounts...\n")
        
        created_accounts = []
        for i in range(count):
            print(f"\n📝 Creating account {i+1}/{count}...")
            account = self.create_account()
            
            if account:
                created_accounts.append(account)
                print(f"✅ Account {i+1} created successfully!")
            else:
                print(f"❌ Failed to create account {i+1}")
            
            # Wait between requests to avoid rate limiting
            import time
            time.sleep(2)
        
        print(f"\n🎉 Created {len(created_accounts)}/{count} accounts successfully!")
        return created_accounts
    
    def verify_account(self, username, password):
        """Verify if account works by logging in"""
        try:
            login_url = f"{self.base_url}/login"
            login_data = {
                'username': username,
                'password': password
            }
            
            response = self.session.post(login_url, data=login_data)
            
            if response.status_code == 200:
                print(f"✅ Account {username} verified successfully!")
                return True
            else:
                print(f"❌ Account {username} verification failed")
                return False
                
        except Exception as e:
            print(f"❌ Error verifying account: {str(e)}")
            return False

# Usage Examples
if __name__ == "__main__":
    creator = TZCionsAccountCreator()
    
    # Option 1: Create single account with random credentials
    print("Option 1: Creating single random account...")
    account = creator.create_account()
    
    # Option 2: Create account with specific credentials
    print("\nOption 2: Creating account with specific credentials...")
    custom_credentials = {
        'username': 'myusername123',
        'password': 'MySecurePass123!',
        'email': 'myemail@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'phone': '+1234567890'
    }
    account = creator.create_account(custom_credentials)
    
    # Option 3: Create multiple accounts
    print("\nOption 3: Creating multiple accounts...")
    accounts = creator.create_multiple_accounts(count=5)
    
    # Option 4: Verify created account
    if account:
        print("\nVerifying account...")
        creator.verify_account(account['username'], account['password'])
