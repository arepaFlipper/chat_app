#!/usr/bin/env python3

import requests, json

endpoint = "http://localhost:8000/api/search/root/"

# Load JSON data from file
with open("./test/send_message.json", "r") as body:
    data = json.load(body)

# Generate a random boundary string
boundary = "----WebKitFormBoundaryexampleboundary"
content_type = "multipart/form-data; boundary=" + boundary
content_type = "multipart/form-data"

# Prepare the data for the multipart request

# Add image files to the data dictionary with the correct boundary

# Make a POST request with multipart/form-data and specify the boundary
get_response = requests.get(endpoint )

print("🔓    create_survey.py:26  post_response.json():")
print(get_response.json())

