import { useMemo } from "react";
import "./PortfolioCard.css";
import { CgFolderAdd, CgAddR, CgTrash, CgFolder } from "react-icons/cg";

const PortfolioCard = ({
  portfolioTriggers,
  portfolioType,
  portfolioName,
  onDeleteIconClick,
  onPortfolioClick,
}) => {
  return (
    <div className="portfoliocardCard">
      <CgTrash className="deleteiconCard" onClick={onDeleteIconClick} />
      <div className="portfolioinfoCard" onClick={onPortfolioClick}>
        <div className="portfolioCard">
          <div className="portfolionameCard">{portfolioName}</div>
          <b className="portfoliotriggersCard">
            {portfolioTriggers} recent triggers
          </b>
          <b
            className="portfoliotypeCard"
            style={
              portfolioType == "Short" ? { color: "red" } : { color: "green" }
            }
          >
            {portfolioType} Position
          </b>
        </div>
        <CgFolder
          className="iconCard"
          style={
            portfolioType == "Short" ? { color: "red" } : { color: "green" }
          }
        />
      </div>
    </div>
  );
};

export default PortfolioCard;
