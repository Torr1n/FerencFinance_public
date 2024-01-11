import { useMemo } from "react";
import "./CardContainer.css";

const CardContainer = ({
  icon,
  title,
  value,
  propBackgroundColor,
  propJustifyContent,
  propAlignSelf,
  propAlignSelf1,
}) => {
  const profitCardStyle = useMemo(() => {
    return {
      backgroundColor: propBackgroundColor,
    };
  }, [propBackgroundColor]);

  const profitStyle = useMemo(() => {
    return {
      justifyContent: propJustifyContent,
    };
  }, [propJustifyContent]);

  const profit1Style = useMemo(() => {
    return {
      alignSelf: propAlignSelf,
    };
  }, [propAlignSelf]);

  const valueStyle = useMemo(() => {
    return {
      alignSelf: propAlignSelf1,
    };
  }, [propAlignSelf1]);

  return (
    <div className="profitcard" style={profitCardStyle}>
      <div className="icon1">{icon}</div>
      <div className="profit" style={profitStyle}>
        <div className="profitnothome" style={profit1Style}>
          {title}
        </div>
        <b className="value" style={valueStyle}>
          {value}
        </b>
      </div>
    </div>
  );
};

export default CardContainer;
