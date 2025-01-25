from flask import Flask, Response, jsonify, request
import google.generativeai as genai
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

# Read API key from secrets
with open("../secrets/gemini_key.txt", "r", encoding="utf-8") as file:
    key = file.read()

# Configure the Gemini model
genai.configure(api_key=key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Setup Flask API
app = Flask(__name__)
CORS(app)

@app.route('/qmaker', methods=['POST'])
def qmaker():
    print('request received')
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    
    text = data['text']

    # Web scrape text from the provided URL
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(text, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text(separator='\n', strip=True)  # Extracts visible text
    else:
        return jsonify({"error": f"Unable to fetch page (Status Code: {response.status_code})"}), 400

    # Generate questions and answers using Gemini API
    prompt = (
        "Generate 3 questions and their respective answers based on the following text. "
        "Return the response in the following JSON format:\n"
        "{'questions': [{'question': '...', 'answer': '...'}, {'question': '...', 'answer': '...'}, ...]} "
        "If there is an error or the content is not meaningful, respond with: {'error': 'there was an error with your request'}\n"
        f"Text:\n{text}"
    )

    try:
        response = model.generate_content(prompt).text
        
        # Ensure the response is valid JSON
        import json
        parsed_response = json.loads(response)
        return jsonify(parsed_response)
    
    except Exception as e:
        return jsonify({"error": "there was an error with your request"}), 500


if __name__ == "__main__":
    app.run(debug=True)
