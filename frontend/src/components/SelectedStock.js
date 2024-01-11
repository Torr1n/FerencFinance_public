import { useCallback } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "./SelectedStock.css";
import { useQuery } from "@tanstack/react-query";
import { fetchStocks, fetchIdealEMA } from "../api/stocks.js";
import { useParams } from "react-router-dom";
import StockInfo from "./StockInfo.js";
import { useCookies } from "react-cookie";

const SelectedStock = () => {
  const { id } = useParams();
  const [token, setToken] = useCookies(["token"]);

  const { data: stocks } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => fetchStocks(token.token),
  });
  var stock;
  if (stocks) {
    stock = stocks.data.find((item) => item.id === id);
  }

  return (
    <Scrollbars style={{ width: "100%", height: "100%" }}>
      <section className="selectedstock1">
        <div className="top-bar">
          <h2 className="stockname5">
            {stock ? stock.attributes.ticker : null}
          </h2>
        </div>
        <StockInfo />
      </section>
    </Scrollbars>
  );
};

export default SelectedStock;
