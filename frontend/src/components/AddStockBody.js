import Title from "./Title";
import Main from "./Main";
import "./AddStockBody.css";

const AddStockBody = ({ onClose }) => {
  return (
    <div className="addStock">
      <Title />
      <Main onClose={onClose} />
    </div>
  );
};

export default AddStockBody;
