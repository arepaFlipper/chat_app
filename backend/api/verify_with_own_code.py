from telesign.messaging import MessagingClient
import environ, os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
env = environ.Env( DEBUG=(bool, False))

def send_sms(phone_number, verify_code):
    customer_id = env("TELESIGN_CUSTOMER_ID")
    api_key = env("TELESIGN_API_KEY")
    message = "Your verification code is: " + str(verify_code) + ". Please do not share this code with anyone."
    
    client = MessagingClient(customer_id, api_key)
    response = client.message(phone_number, message, "ARN")
    return response

