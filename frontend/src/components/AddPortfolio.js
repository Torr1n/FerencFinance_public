import AddPortfolioForm from "./AddPortfolioForm";
import "./AddPortfolio.css";

const AddPortfolio = ({ onClose }) => {
  return (
    <div className="addthestock">
      <section className="AddPortfoliocontainer">
        <AddPortfolioForm onClose={onClose} />
      </section>
    </div>
  );
};

export default AddPortfolio;
