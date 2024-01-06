import AddStockBody from "./AddStockBody";
import "./AddStockForm.css";

const AddStockForm = ({ onClose }) => {
  return (
    <form className="addstockform">
      <div className="logoadd">
        <div className="minilogoadd">
          <h3 className="logotextadd">FF</h3>
        </div>
        <b className="ferencfinanceadd">FerencFinance</b>
      </div>
      <AddStockBody onClose={onClose} />
    </form>
  );
};

export default AddStockForm;
