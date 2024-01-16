import math
import numpy as np
import yfinance as yf
import pandas as pd
import pyxirr as pyxirr
from datetime import datetime, date, timedelta
import copy


def get_stock_data(ticker, startdate=None):
    if startdate:
        stock_data = yf.download(ticker, start=startdate, interval="1wk")
    else:
        stock_data = yf.download(ticker, interval="1wk")

    selected_columns = ["Open", "High", "Low", "Close"]
    if "Date" in stock_data.index.names:
        stock_data.reset_index(inplace=True)

    # Convert the 'Date' column to Unix timestamps
    stock_data["Date"] = (
        stock_data["Date"] - pd.Timestamp("1970-01-01")
    ) // pd.Timedelta("1ms")

    return stock_data.reset_index()[["Date"] + selected_columns].values.tolist()


def calculate_ema(data, period):
    return data["Close"].ewm(span=period, adjust=False).mean()


def undo_date_conversion(date):
    return int(
        (
            datetime.combine(date, datetime.min.time()) - datetime(1970, 1, 1)
        ).total_seconds()
        * 1000
    )


def generate_signals_and_xirr(data):
    lastTransBuy = False
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
            signal = {
                "signal": "Buy",
                "price": data["Open"].iloc[i],
                "date": date,
            }
            signals_data.append(signal)
            cash_flow = {
                "date": datetime.utcfromtimestamp(date / 1000).date(),
                "amount": -100 * data["Open"].iloc[i],
            }
            cash_flow_data.append(cash_flow)
            buying = not buying

        if (not buying) and shouldSell(high, low, close, open, ema_value):
            signal = {
                "signal": "Sell",
                "price": data["Open"].iloc[i],
                "date": date,
            }
            signals_data.append(signal)
            cash_flow = {
                "date": datetime.utcfromtimestamp(date / 1000).date(),
                "amount": 100 * data["Open"].iloc[i],
            }
            cash_flow_data.append(cash_flow)
            buying = not buying

        if (not buying) and (i == (len(data) - 1)):
            lastTransBuy = True
            signal = {
                "signal": "Sell",
                "price": data["Open"].iloc[i],
                "date": date,
            }
            signals_data.append(signal)
            cash_flow = {
                "date": datetime.utcfromtimestamp(date / 1000).date(),
                "amount": 100 * data["Open"].iloc[i],
            }
            cash_flow_data.append(cash_flow)

    cash_flows = pd.DataFrame(cash_flow_data)
    profit = calculate_profits(signals_data)
    if not cash_flows.empty:
        xirr = pyxirr.xirr(cash_flows)
    else:
        xirr = 0
    for cash_flow in cash_flow_data:
        cash_flow["date"] = undo_date_conversion(cash_flow["date"])
    if lastTransBuy:
        cash_flow_data.pop()
        signals_data.pop()
    return signals_data, xirr, cash_flow_data, profit


def date_conversion(date):
    return datetime.utcfromtimestamp(date / 1000).date()


def update_signals_and_xirr(data, signals, cashflows):
    lastTransBuy = False
    buying = True
    if signals[-1]["signal"] == "Buy":
        buying = False
    start_index = data.index[data["Date"] == signals[-1]["date"]].tolist()
    if start_index:
        for i in range(start_index[0], len(data)):
            high = data["High"].iloc[i - 1]
            low = data["Low"].iloc[i - 1]
            close = data["Close"].iloc[i - 1]
            open = data["Open"].iloc[i - 1]
            ema_value = data["EMA"].iloc[i - 1]
            date = data["Date"].iloc[i]

            if buying and shouldBuy(high, low, close, open, ema_value):
                signal = {
                    "signal": "Buy",
                    "price": data["Open"].iloc[i],
                    "date": date,
                }
                signals.append(signal)
                cash_flow = {
                    "date": date,
                    "amount": -100 * data["Open"].iloc[i],
                }
                cashflows.append(cash_flow)
                buying = not buying

            if (not buying) and shouldSell(high, low, close, open, ema_value):
                signal = {
                    "signal": "Sell",
                    "price": data["Open"].iloc[i],
                    "date": date,
                }
                signals.append(signal)
                cash_flow = {
                    "date": date,
                    "amount": 100 * data["Open"].iloc[i],
                }
                cashflows.append(cash_flow)
                buying = not buying

            if (not buying) and (i == (len(data) - 1)):
                lastTransBuy = True
                signal = {
                    "signal": "Sell",
                    "price": data["Open"].iloc[i],
                    "date": date,
                }
                signals.append(signal)
                cash_flow = {
                    "date": date,
                    "amount": 100 * data["Open"].iloc[i],
                }
                cashflows.append(cash_flow)
    cash_flow_no_conversion = copy.deepcopy(cashflows)
    profit = calculate_profits(signals)
    if lastTransBuy:
        cash_flow_no_conversion.pop()
        signals.pop()
    for cash_flow in cashflows:
        cash_flow["date"] = date_conversion(cash_flow["date"])
    cashflowdf = pd.DataFrame(cashflows)
    if not cashflowdf.empty:
        xirr = pyxirr.xirr(cashflowdf)
    else:
        xirr = 0

    return signals, xirr, cash_flow_no_conversion, profit


def shouldBuy(high, low, close, open, ema_value):
    candlePercent = (high - ema_value) / (high - low)
    return (close > open) and (close > ema_value) and (candlePercent > 0.5)


# true if meets sell condition
def shouldSell(high, low, close, open, ema_value):
    candlePercent = (ema_value - low) / (high - low)
    return (close < open) and (close < ema_value) and (candlePercent > 0.5)


def calculate_profits(signals):
    signals = pd.DataFrame(signals)
    if signals.empty:
        return 0
    buys = signals[signals["signal"] == "Buy"]
    sells = signals[signals["signal"] == "Sell"]
    profits = sum(
        ((sell * 100) - (buy * 100)) for buy, sell in zip(buys["price"], sells["price"])
    )
    return profits


def update_stock_data(ticker, stockdata):
    # Find the last date in the existing stock data
    lastdate = pd.to_datetime(stockdata["Date"], unit="ms").max()
    if datetime.now() >= (lastdate + timedelta(days=7)):
        # Get the new data beyond the last date
        new_data = yf.download(ticker, start=lastdate, interval="1wk")
        if not new_data.empty:
            selected_columns = ["Open", "High", "Low", "Close"]
            if "Date" in new_data.index.names:
                new_data.reset_index(inplace=True)

            # Convert the 'Date' column to Unix timestamps
            new_data["Date"] = (
                new_data["Date"] - pd.Timestamp("1970-01-01")
            ) // pd.Timedelta("1ms")

            formatted_data = new_data.reset_index()[
                ["Date"] + selected_columns
            ].values.tolist()

            # If there is new data, append it to the existing stock data
            stockdata = pd.concat(
                [
                    stockdata,
                    pd.DataFrame(
                        formatted_data, columns=["Date", "Open", "High", "Low", "Close"]
                    ),
                ]
            )
            return stockdata.reset_index()[["Date"] + selected_columns].values.tolist()
        else:
            return None
    else:
        return None
