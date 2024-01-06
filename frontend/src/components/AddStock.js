import AddStockForm from "./AddStockForm";
import "./AddStock.css";

const AddStock = ({ onClose }) => {
  return (
    <div className="addthestock">
      <section className="addstockcontainer">
        <AddStockForm onClose={onClose} />
      </section>
    </div>
  );
};

export default AddStock;
