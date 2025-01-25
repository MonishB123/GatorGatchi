from flask import Flask, Response, jsonify, request
import google.generativeai as genai
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup


# read api key from secrets
with open("../secrets/gemini_key.txt", "r", encoding="utf-8") as file:
    key = file.read()

# create model  
genai.configure(api_key=key)
model = genai.GenerativeModel("gemini-1.5-flash")


# setup flask api
app = Flask(__name__)
CORS(app)

# api methods
@app.route('/qmaker', methods = ['POST'])
def qmaker():
    print('request received')
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    
    text = data['text']
    #webscrape text off link
    headers = {'User-Agent': 'Mozilla/5.0'}  # Prevents being blocked
    response = requests.get(text, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text(separator='\n', strip=True)  # Extracts visible text
    else:
        return f"Error: Unable to fetch page (Status Code: {response.status_code})"

    prompt = "<prompt>Generate 3 questions and answers given the following text. Only generate questions that relate to the main theme of the text, if there is a error code, just say exactly 'there was an error with your request' </prompt> <text>" + text + "</text>"
    response = model.generate_content(prompt).text
    return jsonify({"questions" : response})


if __name__ == "__main__":
    app.run(debug=True)