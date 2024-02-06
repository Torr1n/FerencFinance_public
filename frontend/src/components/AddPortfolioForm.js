import AddPortfolioBody from "./AddPortfolioBody";
import "./AddPortfolioForm.css";

const AddPortfolioForm = ({ onClose }) => {
  return (
    <form className="AddPortfolioform">
      <div className="logoadd">
        <div className="minilogoadd">
          <h3 className="logotextadd">FF</h3>
        </div>
        <b className="ferencfinanceadd">FerencFinance</b>
      </div>
      <AddPortfolioBody onClose={onClose} />
    </form>
  );
};

export default AddPortfolioForm;
