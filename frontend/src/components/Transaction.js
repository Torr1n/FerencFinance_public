import "./Transaction.css";

const Transaction = ({ purchaseType, price, date, ticker }) => {
  return (
    <div className="transaction">
      <div className="ticker">
        <div className="transactionicon">
          <img className="icon2" alt="" src="/icon3.svg" />
        </div>
        <div className="tto">{ticker}</div>
      </div>
      <div className="fields">
        <div className="purchasetype">{purchaseType}</div>
        <div className="price">{price}</div>
        <div className="date">{date}</div>
      </div>
    </div>
  );
};

export default Transaction;
