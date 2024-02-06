import "./EMAPeriod.css";
import { useParams, Link } from "react-router-dom";

const EMAPeriod = ({ emaPeriod, xirr = "None", profit, EMAid }) => {
  const { id, period, portfolio } = useParams();
  return (
    <Link
      to={`/${portfolio}/${id}/${EMAid}`}
      style={{ textDecoration: "none" }}
    >
      <div className="emaperiod">
        <div className="periodinfo">
          <div className="xirrAndPeriod">
            <div className="period">{emaPeriod}</div>
            <div className="xirr">XIRR: {xirr}%</div>
          </div>
          <div className="profit2">${profit}</div>
        </div>
      </div>
    </Link>
  );
};

export default EMAPeriod;
