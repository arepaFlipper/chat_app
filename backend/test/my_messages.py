#!/usr/bin/env python3

import requests

endpoint = "http://127.0.0.1:8000/api/my-messages/1/"
access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyODQ0MzM3LCJpYXQiOjE3MTI0MTIzMzcsImp0aSI6ImViYzg5MGY4ZjdhOTRmOGI5N2NkZGYwNzRjOWRlYTc5IiwidXNlcl9pZCI6MSwiZnVsbF9uYW1lIjoiIiwidXNlcm5hbWUiOiJyb290IiwiZW1haWwiOiJyb290QG1haWwuY29tIiwiYmlvIjoiIiwiaW1hZ2UiOiJkZWZhdWx0LmpwZyIsInZlcmlmaWVkIjpmYWxzZX0.hiOgbR0O2AT29K-pbO4pae5vYMaofaruS5u2IKikn4s"

headers = {
    "Authorization": f"Bearer {access_token}"
    
}

# Make a GET request with the access token included in the header
get_response = requests.get(endpoint, headers=headers)

print("🔓    create_survey.py:26  post_response.json():")
print(get_response.json())


