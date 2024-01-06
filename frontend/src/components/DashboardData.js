import CardContainer from "./CardContainer";
import StockGraph from "./StockGraph";
import StockTransactions from "./StockTransactions";
import "./DashboardData.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStocks,
  fetchIdealEMA,
  fetchEMA,
  fetchStock,
} from "../api/stocks.js";
import { FaWallet, FaExclamationCircle } from "react-icons/fa";
import { CgTrending } from "react-icons/cg";
import { useCookies } from "react-cookie";

const DashboardData = () => {
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

  var EMA;
  if (urlEMA) {
    EMA = period ? urlEMA : idealEMA;
  } else if (idealEMA) {
    EMA = idealEMA;
  }
  const title = period ? "EMA Period" : "Optimal EMA Period";

  return (
    <div className="dashboarddata">
      <div className="stocksummary">
        <div className="cards">
          <CardContainer
            icon=<FaWallet className="icon" />
            title="Profit"
            value={EMA ? `$${EMA.data.attributes.profit}` : ""}
            propBackgroundColor="1px solid #282541"
            propJustifyContent="flex-start"
            propAlignSelf="stretch"
            propAlignSelf1="stretch"
          />
          <CardContainer
            icon=<CgTrending className="icon" />
            title={title}
            value={EMA ? EMA.data.attributes.period : ""}
            propBackgroundColor="#201e34"
            propJustifyContent="center"
            propAlignSelf="unset"
            propAlignSelf1="unset"
          />
          <CardContainer
            icon=<FaExclamationCircle className="icon" />
            title="XIRR"
            value={EMA ? (100 * EMA.data.attributes.xirr).toFixed(2) + "%" : ""}
            propBackgroundColor="#201e34"
            propJustifyContent="center"
            propAlignSelf="unset"
            propAlignSelf1="unset"
          />
        </div>
      </div>
      <StockGraph />
      <StockTransactions />
    </div>
  );
};

export default DashboardData;
