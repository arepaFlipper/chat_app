#!/usr/bin/env python3

import requests, json, random

endpoint = "http://localhost:8000/api/register/"
random_number = random.randint(0, 1000)

# Load JSON data from file

data = {
    "email": f"user{random_number}@mail.com",
    "password": "random_pass",
    "password2": "random_pass",
    "username": "root",
    "phone_number": "",
}
# Generate a random boundary string
boundary = "----WebKitFormBoundaryexampleboundary"
content_type = "multipart/form-data; boundary=" + boundary
content_type = "multipart/form-data"

# Prepare the data for the multipart request

# Add image files to the data dictionary with the correct boundary

# Make a POST request with multipart/form-data and specify the boundary
post_response = requests.post(endpoint, data=data )

print("🔓    create_survey.py:26  post_response.json():")
print(post_response.json())

