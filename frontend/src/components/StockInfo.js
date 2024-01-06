import { useCallback } from "react";
import DashboardData from "./DashboardData";
import AdditionalInfo from "./AdditionalInfo";
import "./StockInfo.css";

const StockInfo = () => {
  const onEMAPeriodContainerClick1 = useCallback(() => {
    //TODO: change page to be for this ema period
  }, []);

  return (
    <section className="stockinfo">
      <DashboardData />
      <AdditionalInfo />
    </section>
  );
};

export default StockInfo;
