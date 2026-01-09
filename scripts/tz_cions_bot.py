"""
TZ-Cions Login Automation Script
WARNING: Use at your own risk. Change credentials after use.
"""

import requests
from bs4 import BeautifulSoup

class TZCionsBot:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.base_url = "http://tz-cions.com"
        
    def login(self):
        """Login to TZ-Cions"""
        try:
            # Get login page
            login_url = f"{self.base_url}/login"
            response = self.session.get(login_url)
            
            # Parse login form
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find login form and CSRF token if exists
            form = soup.find('form')
            csrf_token = None
            if form:
                csrf_input = form.find('input', {'name': '_token'})
                if csrf_input:
                    csrf_token = csrf_input.get('value')
            
            # Prepare login data
            login_data = {
                'username': self.username,
                'password': self.password
            }
            
            if csrf_token:
                login_data['_token'] = csrf_token
            
            # Submit login
            response = self.session.post(login_url, data=login_data)
            
            if response.status_code == 200:
                print("✅ Login successful!")
                return True
            else:
                print(f"❌ Login failed. Status: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return False
    
    def get_dashboard(self):
        """Get dashboard data"""
        try:
            dashboard_url = f"{self.base_url}/dashboard"
            response = self.session.get(dashboard_url)
            
            if response.status_code == 200:
                print("✅ Dashboard accessed")
                return response.text
            else:
                print(f"❌ Dashboard access failed")
                return None
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return None
    
    def extract_data(self):
        """Extract relevant data from dashboard"""
        dashboard = self.get_dashboard()
        if dashboard:
            soup = BeautifulSoup(dashboard, 'html.parser')
            
            # Extract data based on website structure
            # Customize this based on what you need
            
            data = {
                'balance': None,
                'transactions': [],
                'status': None
            }
            
            # Example: Find balance
            balance_elem = soup.find('div', {'class': 'balance'})
            if balance_elem:
                data['balance'] = balance_elem.text.strip()
            
            return data
        return None

# Usage
if __name__ == "__main__":
    # IMPORTANT: Change these credentials immediately after use
    USERNAME = "YOUR_USERNAME"  # Don't hardcode real credentials
    PASSWORD = "YOUR_PASSWORD"
    
    bot = TZCionsBot(USERNAME, PASSWORD)
    
    # Login
    if bot.login():
        # Get data
        data = bot.extract_data()
        print(f"Data: {data}")
    else:
        print("Login failed")
