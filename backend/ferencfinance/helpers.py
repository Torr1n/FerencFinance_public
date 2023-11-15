import math
import numpy as np
import yfinance as yf
import pandas as pd
import pyxirr as pyxirr


def get_stock_data(ticker, startdate=None):
    if startdate:
        stock_data = yf.download(ticker, start=startdate, interval="1wk")
    else:
        stock_data = yf.download(ticker, interval="1wk")
    return stock_data


def calculate_ema(data, period):
    return data["Close"].ewm(span=period, adjust=False).mean()


def generate_signals_and_xirr(data):
    buying = True
    signals_data = []
    volatility_data = []
    cash_flow_data = []

    for i in range(1, len(data)):
        high = data["High"].iloc[i - 1]
        low = data["Low"].iloc[i - 1]
        close = data["Close"].iloc[i - 1]
        open = data["Open"].iloc[i - 1]
        ema_value = data["EMA"].iloc[i - 1]
        date = data["Date"].iloc[i]

        if not buying:
            nextClose = data["Close"].iloc[i]
            ln = math.log(nextClose / close)
            volatility_data.append(ln)

        if buying and shouldBuy(high, low, close, open, ema_value):
            signal = {"signal": "Buy", "price": data["Open"].iloc[i], "date": date}
            signals_data.append(signal)
            cash_flow = {"date": date, "amount": -1 * data["Open"].iloc[i]}
            cash_flow_data.append(cash_flow)
            buying = not buying

        if (not buying) and shouldSell(high, low, close, open, ema_value):
            signal = {"signal": "Sell", "price": data["Open"].iloc[i], "date": date}
            signals_data.append(signal)
            cash_flow = {"date": date, "amount": data["Open"].iloc[i]}
            cash_flow_data.append(cash_flow)
            buying = not buying

    cash_flows = pd.DataFrame(cash_flow_data)
    xirr = pyxirr.xirr(cash_flows)
    print(xirr)
    signals = pd.DataFrame(signals_data)
    return signals, xirr, cash_flows


def shouldBuy(high, low, close, open, ema_value):
    candlePercent = (high - ema_value) / (high - low)
    return (close > open) and (close > ema_value) and (candlePercent > 0.5)


# true if meets sell condition
def shouldSell(high, low, close, open, ema_value):
    candlePercent = (ema_value - low) / (high - low)
    return (close < open) and (close < ema_value) and (candlePercent > 0.5)


def calculate_profits(signals):
    buys = signals[signals["signal"] == "Buy"]
    sells = signals[signals["signal"] == "Sell"]
    profits = sum(sell - buy for buy, sell in zip(buys["price"], sells["price"]))
    return profits
