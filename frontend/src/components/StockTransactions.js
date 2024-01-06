import Transaction from "./Transaction";
import "./StockTransactions.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStocks,
  fetchIdealEMA,
  fetchEMA,
  fetchStock,
} from "../api/stocks.js";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useCookies } from "react-cookie";

const StockTransactions = () => {
  const [token, setToken] = useCookies(["token"]);
  const { id, period } = useParams();

  const { data: stock } = useQuery({
    queryKey: ["stock"],
    queryFn: () => fetchStock(id, token.token),
  });
  const { data: urlEMA } = useQuery({
    queryKey: ["EMA"],
    queryFn: () => fetchEMA(period, token.token),
  });

  const { data: idealEMA } = useQuery({
    queryKey: ["idealEMA"],
    queryFn: () => fetchIdealEMA(id, token.token),
  });
  const EMA = period ? urlEMA : idealEMA;

  if (stock) {
    return (
      <div className="stocktransactions">
        <div className="title">
          <div className="transactions">Transactions</div>
        </div>
        <div className="header">
          <div className="ticker">Ticker</div>
          <div className="fieldheaders">
            <div className="purchasetype">TYPE</div>
            <div className="purchasetype">PRICE</div>
            <div className="purchasetype">DATE</div>
          </div>
        </div>
        <div className="main">
          <Scrollbars style={{ width: "100%", height: "100%" }}>
            {EMA
              ? JSON.parse(EMA.data.attributes.signals).map(
                  (transaction, i) => (
                    <Transaction
                      id={i}
                      key={i}
                      ticker={stock.data.attributes.ticker}
                      purchaseType={transaction.signal}
                      price={transaction.price.toFixed(2)}
                      date={new Date(transaction.date).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    />
                  )
                )
              : null}
          </Scrollbars>
        </div>
      </div>
    );
  }
};

export default StockTransactions;
