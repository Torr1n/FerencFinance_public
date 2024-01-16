import "./HomePage.css";
import { FaFileExcel } from "react-icons/fa";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllIdealEMAs,
  fetchExcelData,
  updateAllStocks,
} from "../api/stocks.js";
import { useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const HomePage = () => {
  const [token, setToken] = useCookies(["token"]);
  const naviagte = useNavigate();
  if (!token) {
    naviagte("/login");
  }
  const queryClient = useQueryClient();

  const updateStocksMutation = useMutation({
    mutationFn: updateAllStocks,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["allIdealEMAs"] });
    },
  });
  useEffect(() => {
    updateStocksMutation.mutate(token.token);
  }, []);

  const { data: stocks } = useQuery({
    queryKey: ["allIdealEMAs"],
    queryFn: () => fetchAllIdealEMAs(token.token),
  });

  const { data: excelData } = useQuery({
    queryKey: ["ExcelData"],
    queryFn: () => fetchExcelData(token.token),
  });

  const exportFile = useCallback(() => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stocks");
    // Add data
    const columns = [];
    for (let i = 0; i < excelData.data.length; i++) {
      columns.push(
        { header: `Ticker`, key: `ticker${i}` },
        { header: `Price`, key: `profit${i}`, width: 12 },
        { header: `XIRR`, key: `xirr${i}` },
        { header: "Period", key: `period${i}` },
        { header: "", key: `${i}` }
      );
    }
    worksheet.columns = columns;

    excelData.data.forEach((entry, colIndex) => {
      const { ticker, profit, xirr, period, signals } = entry;
      const col1Head = ["Ticker", ticker, "", "Signal"];
      const col1Body = signals.map((signal) => signal.signal).flat();
      const col1 = [...col1Head, ...col1Body];
      const col2Head = ["Profit", profit, "", "Date"];
      const col2Body = signals.map((signal) => new Date(signal.date)).flat();
      const col2 = [...col2Head, ...col2Body];
      const col3Head = ["XIRR", xirr * 100, "", "Price"];
      const col3Body = signals.map((signal) => signal.price).flat();
      const col3 = [...col3Head, ...col3Body];
      const col4 = ["Period", period];

      // Add stock information to the worksheet
      worksheet.getColumn(`ticker${colIndex}`).values = col1;
      worksheet.getColumn(`profit${colIndex}`).values = col2;
      worksheet.getColumn(`xirr${colIndex}`).values = col3;
      worksheet.getColumn(`period${colIndex}`).values = col4;
    });
    // Export the workbook to an Excel file
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileSaver.saveAs(blob, "Portfolio.xlsx");
      })
      .catch((err) => {
        console.error("Error creating Excel file:", err);
      });
  }, [excelData]);

  const stockClassName = (recent_trans) => {
    switch (recent_trans) {
      case "Buy":
        return "stockhomepagebuy";
      case "Sell":
        return "stockhomepagesell";
      default:
        return "stockhomepage";
    }
  };

  useEffect(() => {
    const outerDiv = document.querySelector(".xirrgraph-icon");
    if (outerDiv) {
      const innerDiv = outerDiv.firstChild;
      if (innerDiv) {
        innerDiv.style.width = "100%";
        innerDiv.style.height = "100%";
      }
    }
  }, [stocks]);
  var series = [];
  var options;

  if (stocks) {
    for (const stock of stocks.data) {
      const stockSeries = {
        type: "scatter",
        name: "Ticker:  " + stock.stock_ticker,
        id: stock.stock_ticker,
        data: [
          [
            parseFloat((100 * stock.ema_period.xirr).toFixed(2)),
            stock.ema_period.profit,
          ],
        ],
        marker: {
          symbol: "circle",
        },
      };
      series.push(stockSeries);
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
            radius: 5,
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
  return (
    <Scrollbars style={{ width: "100%", height: "100%" }}>
      <main className="homepage">
        <div className="top-bar-home">
          <h2 className="stockhomepagename">Portfolio Overview</h2>
        </div>
        <section className="stockhomepageinfo">
          <div className="dashboarddata">
            <div className="xirrgraph-icon">
              {options ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  style="width: 100%"
                />
              ) : null}
            </div>
            <div className="selectedstockhomepage" onClick={exportFile}>
              <FaFileExcel className="excelicon" />
              <div className="exceldownload">Download to Excel</div>
            </div>
          </div>
          <div className="additionalinfohomepage">
            <div className="stockhomepagetransactions">
              <div className="titlehomepage">
                <div className="stockhomepages">Stocks</div>
              </div>
              <div className="header">
                <div className="tickerhomepage">TICKER</div>
                <div className="fieldheaders">
                  <div className="thisweek">THIS WEEK</div>
                  <div className="thisweek">PROFIT</div>
                  <div className="thisweek">XIRR</div>
                </div>
              </div>
              <div className="main">
                {stocks
                  ? stocks.data.map((stock) => (
                      <div className={stockClassName(stock.recent_trans)}>
                        <div className="tickerhomepage1">
                          <div className="tto">{stock.stock_ticker}</div>
                        </div>
                        <nav className="fields">
                          <div className="thisweek1">{stock.recent_trans}</div>
                          <div className="profit1">
                            ${stock.ema_period.profit}
                          </div>
                          <div className="xirr1">
                            {(stock.ema_period.xirr * 100).toFixed(2)}%
                          </div>
                        </nav>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Scrollbars>
  );
};

export default HomePage;
