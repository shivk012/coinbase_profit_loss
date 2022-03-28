from dotenv import load_dotenv
from api.client import Coinbase
import os


from flask import Flask, Response

app = Flask(__name__)


@app.route("/")
def main_page():
    return "Hello World"


@app.route("/summary")
def return_summary():
    load_dotenv()
    df = Coinbase(os.getenv("API_KEY"), os.getenv("API_SECRET")).profit_loss

    return Response(df.to_json(), mimetype="application/json")
