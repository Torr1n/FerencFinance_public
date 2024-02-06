import AddPortfolioTitle from "./AddPortfolioTitle";
import AddPortfolioMain from "./AddPortfolioMain";
import "./AddPortfolioBody.css";

const AddPortfolioBody = ({ onClose }) => {
  return (
    <div className="AddPortfolio">
      <AddPortfolioTitle />
      <AddPortfolioMain onClose={onClose} />
    </div>
  );
};

export default AddPortfolioBody;
