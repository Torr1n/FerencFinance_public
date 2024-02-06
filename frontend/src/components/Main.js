import { useState } from "react";
import "./Main.css";
import { addStock } from "../api/stocks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

const Main = ({ onClose }) => {
  const [token, setToken] = useCookies(["token"]);
  const { portfolio } = useParams();

  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const addStockMutation = useMutation({
    mutationFn: addStock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["allIdealEMAs"] });
      queryClient.invalidateQueries({ queryKey: ["ExcelData"] });
      queryClient.invalidateQueries({ queryKey: ["portfoliostocks"] });
      if (data.errors) {
        setErrorMessage(data.errors[0].detail);
      } else {
        onClose();
      }
    },
  });

  const handleSubmit = () => {
    const body = {
      ticker: ticker.toUpperCase(),
      startDate: date,
      portfolio_id: portfolio,
    };
    const bodyToken = { body, token };
    addStockMutation.mutate(bodyToken);
  };
  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState("");
  return (
    <div className="mainform">
      {addStockMutation.isError ? (
        <div className="errorMessage">Invalid Ticker</div>
      ) : null}
      {errorMessage ? <div className="errorMessage">{errorMessage}</div> : null}
      <div className="inputsform">
        <div className="input2">
          <div className="ticker">
            <div className="startDate">Ticker</div>
          </div>
          <input
            className="input3"
            placeholder="Enter a valid ticker"
            type="text"
            value={ticker}
            onChange={(event) => setTicker(event.target.value)}
          />
        </div>
        <div className="input4">
          <div className="ticker">
            <div className="startDate">Start Date</div>
          </div>
          <input
            className="input3"
            placeholder="YYYY-MM-DD"
            type="text"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>
      <div className="submit1" onClick={handleSubmit}>
        <div className="addStockMain">Add Stock</div>
      </div>
    </div>
  );
};

export default Main;
