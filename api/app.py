from dotenv import load_dotenv
from api.client import Coinbase
import os
import json

from flask import Flask, Response

app = Flask(__name__)


@app.route("/")
def main_page():
    return "Hello World"


@app.route("/summary")
def return_summary():
    load_dotenv()
    df = Coinbase(os.getenv("API_KEY"), os.getenv("API_SECRET")).profit_loss
    df.rename(
        columns={
            "amount.currency": "Coin",
            "native_amount.amount": "Number of Coins",
            "Current Value": "Value in GBP",
            "profit_loss": "Profit in GBP",
        },
        inplace=True,
    )  # type: ignore

    look_up = {
        "Coin": {"Header": "Coin", "accessor": "Coin"},
        "Number of Coins": {"Header": "Number of Coins", "accessor": "Number of Coins"},
        "Value in GBP": {"Header": "Value in GBP", "accessor": "Value in GBP"},
        "Profit in GBP": {"Header": "Profit in GBP", "accessor": "Profit in GBP"},
    }

    columns = df.columns.tolist()
    columns = [look_up[col] for col in columns]
    output = json.loads(df.to_json(orient="records"))

    return Response(
        json.dumps({"columns": columns, "output": output}), mimetype="application/json"
    )
