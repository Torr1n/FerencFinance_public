import { useCallback } from "react";
import EMAPeriod from "./EMAPeriod";
import "./EMAPeriods.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllEMAs } from "../api/stocks.js";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useCookies } from "react-cookie";

const EMAPeriods = () => {
  const [token, setToken] = useCookies(["token"]);

  const { id, period } = useParams();

  const { data: EMAs } = useQuery({
    queryKey: ["allEMAs"],
    queryFn: () => fetchAllEMAs(id, token.token),
  });

  return (
    <div className="emaperiods">
      <div className="title">
        <div className="emaPeriods">EMA Periods</div>
        <div className="emaPeriods">Profit</div>
      </div>
      <div className="main">
        <Scrollbars style={{ width: "100%", height: "100%" }}>
          {EMAs
            ? EMAs.data.map((EMA, i) => (
                <EMAPeriod
                  key={i}
                  EMAid={EMA.id}
                  emaPeriod={EMA.attributes.period}
                  profit={EMA.attributes.profit}
                  xirr={(100 * EMA.attributes.xirr).toFixed(2)}
                />
              ))
            : null}
        </Scrollbars>
      </div>
    </div>
  );
};

export default EMAPeriods;
