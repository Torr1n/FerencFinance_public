import "./StockGraph.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchStocks,
  fetchIdealEMA,
  fetchEMA,
  fetchStock,
} from "../api/stocks.js";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const StockGraph = () => {
  const { id, period } = useParams();
  const [token, setToken] = useCookies(["token"]);

  const { data: stock, refetch: refreshStock } = useQuery({
    queryKey: ["stock"],
    queryFn: () => fetchStock(id, token.token),
  });
  const { data: urlEMA, refetch: refreshUrlEMA } = useQuery({
    queryKey: ["EMA"],
    queryFn: () => fetchEMA(period, token.token),
  });

  const { data: idealEMA, refetch: refreshIdealEMA } = useQuery({
    queryKey: ["idealEMA"],
    queryFn: () => fetchIdealEMA(id, token.token),
  });

  useEffect(() => {
    if (period) {
      refreshUrlEMA();
    } else {
      refreshIdealEMA();
      refreshStock();
    }
  }, [id, period]);

  const EMA = period ? urlEMA : idealEMA;

  useEffect(() => {
    const outerDiv = document.querySelector(".stockgraph");
    if (outerDiv) {
      const innerDiv = outerDiv.firstChild;
      if (innerDiv) {
        innerDiv.style.width = "100%";
      }
    }
  }, [EMA, stock]);

  var data;
  if (stock) {
    data = JSON.parse(stock.data.attributes.data);
  }

  var emadata;
  var flags = [];
  if (EMA) {
    emadata = JSON.parse(EMA.data.attributes.ema);
    const signals = JSON.parse(EMA.data.attributes.signals);
    for (let i = 0; i < signals.length; i++) {
      const currentObject = signals[i];
      const formattedObject = {
        x: currentObject.date,
        y: currentObject.price,
        title: currentObject.signal,
      };
      flags.push(formattedObject);
    }
  }

  var options;
  if (data && emadata) {
    options = {
      rangeSelector: {
        selected: 1,
      },
      chart: {
        styledMode: true,
      },

      series: [
        {
          turboThreshold: 0,
          type: "candlestick",
          name: stock.data.attributes.ticker,
          data: data,
          tooltip: {
            valueDecimals: 2,
          },
        },
        {
          type: "flags",
          data: flags,
        },
        {
          name: EMA.data.attributes.period,
          data: emadata,
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    };
  }

  return (
    <div className="stockgraph">
      {options ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      ) : null}
    </div>
  );
};

export default StockGraph;
