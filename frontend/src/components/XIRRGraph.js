import "./XIRRGraph.css";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllEMAs } from "../api/stocks.js";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const XIRRGraph = () => {
  const [token, setToken] = useCookies(["token"]);
  const { id, period } = useParams();

  const { data: EMAs, refetch: refreshEMA } = useQuery({
    queryKey: ["allEMAs"],
    queryFn: () => fetchAllEMAs(id, token.token),
  });
  useEffect(() => {
    refreshEMA();
  }, [id]);
  useEffect(() => {
    const outerDiv = document.querySelector(".xirrgraphIcon");
    if (outerDiv) {
      const innerDiv = outerDiv.firstChild;
      if (innerDiv) {
        innerDiv.style.width = "100%";
      }
    }
  }, [EMAs]);
  var series = [];
  var options;
  if (EMAs) {
    for (const ema of EMAs.data) {
      const emaSeries = {
        type: "scatter",
        name: "Period " + ema.attributes.period,
        id: ema.attributes.period,
        data: [
          [
            parseFloat((100 * ema.attributes.xirr).toFixed(2)),
            parseFloat(ema.attributes.profit),
          ],
        ],
        marker: {
          symbol: "circle",
        },
      };
      series.push(emaSeries);
    }

    options = {
      chart: {
        styledMode: true,
        type: "scatter",
        zoomType: "xy",
      },
      legend: {
        enabled: false,
      },
      title: {
        text: "XIRR vs Profit",
        align: "left",
      },
      xAxis: {
        title: {
          text: "XIRR",
        },
        labels: {
          format: "{value}%",
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: "Profit",
        },
        labels: {
          format: "${value}",
        },
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 2.5,
            symbol: "circle",
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          states: {
            hover: {
              marker: {
                enabled: false,
              },
            },
          },
          jitter: {
            x: 0.005,
          },
        },
      },
      tooltip: {
        pointFormat: "xirr: {point.x}% <br/> Profit: ${point.y}",
      },
      series: series,
    };
  }

  console.log(options);

  return (
    <div className="xirrgraphIcon">
      {options ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          style="width: 100%"
        />
      ) : null}
    </div>
  );
};

export default XIRRGraph;
