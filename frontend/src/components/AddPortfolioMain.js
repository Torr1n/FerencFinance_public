import { useState } from "react";
import "./AddPortfolioMain.css";
import { addPortfolio } from "../api/stocks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

const AddPortfolioMain = ({ onClose }) => {
  const [token, setToken] = useCookies(["token"]);

  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  const AddPortfolioMutation = useMutation({
    mutationFn: addPortfolio,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      if (data.errors) {
        setErrorMessage(data.errors[0].detail);
      } else {
        onClose();
      }
    },
  });

  const handleSubmit = () => {
    const body = {
      name: name,
      type: type,
    };
    const bodyToken = { body, token };
    AddPortfolioMutation.mutate(bodyToken);
  };
  const [name, setName] = useState("");
  const [type, setType] = useState("Long");
  return (
    <div className="mainform">
      {AddPortfolioMutation.isError ? (
        <div className="errorMessage">
          Invalid Portfolio - Ask Torrin Shouldn't See
        </div>
      ) : null}
      {errorMessage ? <div className="errorMessage">{errorMessage}</div> : null}
      <div className="inputsform">
        <div className="input2">
          <div className="ticker">
            <div className="startDate">Name</div>
          </div>
          <input
            className="input3"
            placeholder="Enter a portfolio name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="input4">
          <div className="ticker">
            <div className="startDate">Type</div>
          </div>
          <select
            id="durationDropdown"
            value={type}
            className="input3"
            onChange={(event) => setType(event.target.value)}
          >
            <option value="Short">Short</option>
            <option value="Long">Long</option>
          </select>
        </div>
      </div>
      <div className="submit1" onClick={handleSubmit}>
        <div className="addStockMain">Add Portfolio</div>
      </div>
    </div>
  );
};

export default AddPortfolioMain;
