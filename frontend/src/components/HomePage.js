import "./HomePage.css";

const HomePage = () => {
  return (
    <main className="homepage">
      <div className="top-bar">
        <h2 className="stockname">Portfolio Overview</h2>
      </div>
      <section className="stockinfo">
        <div className="dashboarddata">
          <img className="xirrgraph-icon" alt="" src="/xirrgraph@2x.png" />
          <button className="selectedstock">
            <img className="excelicon" alt="" src="/stockicon.svg" />
            <div className="exceldownload">Download to Excel</div>
          </button>
        </div>
        <div className="additionalinfo">
          <div className="stocktransactions">
            <div className="title">
              <div className="stocks">Stocks</div>
            </div>
            <div className="header">
              <div className="ticker">TICKER</div>
              <div className="fieldheaders">
                <div className="thisweek">THIS WEEK</div>
                <div className="thisweek">PROFIT</div>
                <div className="thisweek">XIRR</div>
              </div>
            </div>
            <div className="main">
              <div className="stock">
                <div className="ticker1">
                  <div className="tto">T.TO</div>
                </div>
                <nav className="fields">
                  <div className="thisweek1">SELL</div>
                  <div className="profit1">$13.84</div>
                  <div className="xirr1">12.28%</div>
                </nav>
              </div>
              <div className="stock1">
                <div className="ticker1">
                  <div className="tto">T.TO</div>
                </div>
                <div className="fields1">
                  <div className="thisweek">NONE</div>
                  <div className="thisweek">$13.84</div>
                  <div className="thisweek">12.28%</div>
                </div>
              </div>
              <div className="stock2">
                <div className="ticker1">
                  <div className="tto">T.TO</div>
                </div>
                <div className="fields2">
                  <div className="thisweek">BUY</div>
                  <div className="thisweek">$13.84</div>
                  <div className="thisweek">12.28%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
