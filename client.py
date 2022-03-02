from requests.auth import AuthBase
import requests
from datetime import datetime
import hmac
import hashlib
import pandas as pd
import json


class Coinbase_Auth(AuthBase):
    def __init__(self, API_KEY, API_SECRET):
        self.API_KEY = API_KEY
        self.API_SECRET = API_SECRET

    def __call__(self, request):
        timestamp = datetime.now().strftime("%s")
        message = f"{timestamp}{request.method}{request.path_url}{request.body or ''}"
        signature = hmac.new(
            self.API_SECRET.encode(), message.encode("utf-8"), digestmod=hashlib.sha256
        )
        signature_hex = signature.hexdigest()

        request.headers.update(
            {
                "CB-ACCESS-SIGN": signature_hex,
                "CB-ACCESS-TIMESTAMP": timestamp.encode(),
                "CB-ACCESS-KEY": self.API_KEY.encode(),
                "Content-Type": "application/json",
            }
        )

        return request


class Coinbase:
    def __init__(self, API_KEY, API_SECRET):
        self.API_KEY = API_KEY
        self.API_SECRET = API_SECRET
        self.URL = "https://api.coinbase.com"
        self._accounts()
        self._retrieve_transactions()
        self._get_rates()
        self._get_money_against_currency()

    def _request(self, request_path):
        auth = Coinbase_Auth(self.API_KEY, self.API_SECRET)
        return requests.get(f"{self.URL}{request_path}", auth=auth)

    def _collate_paginated(self, initial_url):
        data = []
        r = self._request(f"{initial_url}?limit=100").json()
        data.extend(r["data"])
        while next_url := r["pagination"]["next_uri"]:
            r = self._request(next_url).json()
            data.extend(r["data"])
        return data

    def _accounts(self):
        request_path = "/v2/accounts"
        data = self._collate_paginated(request_path)
        df = pd.json_normalize(data)
        df = df[["id", "balance.amount", "balance.currency"]]
        df["balance.amount"] = pd.to_numeric(df["balance.amount"])
        self.accounts = df.loc[df["id"] != df["balance.currency"]]

    def _get_transaction_for_account(self, id):
        request_path = f"/v2/accounts/{id}/transactions"
        r = self._request(request_path)
        return pd.json_normalize(json.loads(r.content)["data"])

    def _retrieve_transactions(self):
        df_tr = [
            self._get_transaction_for_account(self.accounts["id"][i])
            for i in self.accounts.index
        ]

        df = pd.concat(df_tr, ignore_index=True)
        self.transactions = df
        self.transactions["native_amount.amount"] = pd.to_numeric(
            self.transactions["native_amount.amount"]
        )

    def _get_rates(self):
        request_path = "/v2/exchange-rates?currency=GBP"
        rates = self._request(request_path).json()["data"]["rates"]
        for k, v in rates.items():
            rates[k] = float(v)
        self.rates = rates

    def _get_money_against_currency(self):
        df = (
            self.transactions.groupby("amount.currency")["native_amount.amount"]
            .sum()
            .to_frame()
            .reset_index()
        )
        df["Current Value"] = df["amount.currency"].apply(
            lambda currency: self.accounts[self.accounts["balance.currency"] == currency]["balance.amount"].iloc[0]/self.rates.get(currency, 0)
        )
        df = df[~df["amount.currency"].isin(["GBP", "USDC", "USDT"])]
        self.profit_loss = df
