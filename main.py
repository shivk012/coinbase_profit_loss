from dotenv import load_dotenv
from client import Coinbase
import os
import time
if __name__ == '__main__':
    load_dotenv()
    start = time.time()
    client = Coinbase(os.getenv("API_KEY"), os.getenv("API_SECRET"))
    end = time.time()
    print(end-start)
    print(client.transactions)   