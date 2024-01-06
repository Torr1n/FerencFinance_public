import { useCallback } from "react";
import XIRRGraph from "./XIRRGraph";
import EMAPeriods from "./EMAPeriods";
import "./AdditionalInfo.css";

const AdditionalInfo = () => {
  const onEMAPeriodContainerClick1 = useCallback(() => {
    //TODO: change page to be for this ema period
  }, []);

  return (
    <div className="additionalinfo">
      <XIRRGraph />
      <EMAPeriods />
    </div>
  );
};

export default AdditionalInfo;
