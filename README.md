# FerencFinance: A Full-Stack Portfolio Management Application for Technical Analysis and Trading Strategy Optimization

Independent technical analysts within equity and options markets may often rely on time-consuming manual calculations and spreadsheet-driven workflows not adapted to modern data-analysis and automation workflows common in Python. This presents a significant barrier to their ability to rapidly evaluate strategies on a wide investment universe and deploy these strategies on live data. To address these pain points, I created FerencFinance: a full-stack portfolio management and strategy dashboard web application specifically tailored to the needs of such an independent technical analyst.

# Features:

FerencFinance streamlines technical indicator optimization by directly calculating and maximizing the profitability of trading strategies informed by the Exponential Moving Average (EMA) which is also further used in technical indicators like the RSI or the ADX. To allow the independent analyst to continue to leverage their preferred analysis methods like Excel and TradingView, FerencFinance allows for customized data export directly into CSV. This export formats cashflows for the calculation of essential risk metrics such as Maximum Drawdown and the Sharpe Ratio which significantly reduces the need for manual spreadsheet work. Additionally, FerencFinance streamlines the back-testing of strategies on a portfolio of stocks by automatically generating an interactive graph of buy/sell signals and plotting strategy returns over the entire parameter space. Finally, integration with the Python library yfinance automatically updates market data which enables the tracking of recent triggers and ensures EMA analyses are based on live stock data.

# Results:

This web app has been instrumental in reducing manual excel optimization workflows by nearly 100%, allowing the user to allocate their time to the analysis and creation of trading strategies rather than performing calculations. Most importantly, since incorporating this tool into their workflow, the independent analyst that is using FerencFinance has achieved a 36% Return on Investment in 5 weeks on options trades directly informed by the application's insights.

# Future Considerations:

FerencFinance is a constantly evolving project as the needs of the technical analyst change, and I envision several key areas for future development. First, I intend on applying the skills I honed as a certified AWS Cloud Practitioner to deploy the application to the cloud which will improve accessibility and provide infrastructure to handle larger datasets as strategies are added. Additionally, I am working on a secondary project with the technical analyst to explore training and integrating a machine learning model to provide advanced signal filtering capabilities, potentially further enhancing the applications out-of-sample performance. Furthermore, the current backtesting methodology is a textbook example of an in-sample backtest (Carver, 2015) and inherently overfit. To address these limitations, implementing a rolling-window or walk-forward analysis technique would allow for more rigorous and reliable strategy evaluation. Finally, I intend to migrate the app to use Interactive Broker’s API for higher granularity and second-accurate live ticker data, demonstrating my commitment to creating an application that uses an industry grade data provider.

# Motivation:

FerencFinance exemplifies my initiative in understanding and addressing real-world parameter optimization and technical analysis automation challenges faced by independent financial analysts. This project highlights my passion for leveraging technology to streamline quantitative analysis and, ultimately, improve the investment decision-making process.
Technologies Used: Python (Django, NumPy, pandas), React, SQLite

# References

Carver, R. (2015). Systematic trading: A unique new method for designing trading and investing systems. Harriman House Ltd.
