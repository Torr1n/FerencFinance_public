import PortfolioCard from "../components/PortfolioCard";
import "./Portfolios.css";
import { useState, useEffect } from "react";
import AddPortfolio from "./AddPortfolio";
import PortalPopup from "./PortalPopup";
import {
  fetchPortfolios,
  deletePortfolio,
  addPortfolio,
  updateAllStocks,
} from "../api/stocks.js";
import { useQuery } from "@tanstack/react-query";
import { CgFolderAdd, CgAddR, CgTrash, CgFolder } from "react-icons/cg";
import {
  useLocation,
  Link,
  useParams,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

const Portfolios = () => {
  const [token, setToken] = useCookies("token");
  const location = useLocation();
  const navigate = useNavigate();
  const { data: portfolios } = useQuery({
    queryKey: ["portfolios"],
    queryFn: () => fetchPortfolios(token.token),
  });
  const queryClient = useQueryClient();

  const updateStocksMutation = useMutation({
    mutationFn: updateAllStocks,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["portfoliostocks"] });
      queryClient.invalidateQueries({ queryKey: ["allIdealEMAs"] });
      queryClient.invalidateQueries({ queryKey: ["ExcelData"] });
    },
  });
  useEffect(() => {
    updateStocksMutation.mutate(token.token);
  }, []);

  const deletePortfolioMutation = useMutation({
    mutationFn: deletePortfolio,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });

  const [isAddPortfolioPopupOpen, setAddPortfolioPopupOpen] = useState(false);

  const onDeleteIconClick = (toDeleteId) => {
    const idToken = { id: toDeleteId, token: token.token };
    deletePortfolioMutation.mutate(idToken);
  };

  const onPortfolioClick = (portfolioId) => {
    navigate(`/${portfolioId}`);
  };

  const openAddPortfolioPopup = () => {
    setAddPortfolioPopupOpen(true);
  };

  const closeAddPortfolioPopup = () => {
    setAddPortfolioPopupOpen(false);
  };

  return (
    <>
      <div className="homepage1">
        <main className="page">
          <header className="logo1">
            <div className="minilogo1">
              <h3 className="ferenc-finance-title">FF</h3>
            </div>
            <b className="ferencfinance1">FerencFinance</b>
          </header>
          <div className="title1">
            <b className="portfolios">Manage Portfolios</b>
          </div>
          <Scrollbars
            style={{ width: "100%", height: "100vh", background: "#1c1a2e" }}
          >
            <section className="portfolios1">
              {portfolios
                ? portfolios.data.map((portfolio) => (
                    <PortfolioCard
                      portfolioTriggers={portfolio.attributes.recent_trans_sum}
                      portfolioType={portfolio.attributes.type}
                      portfolioName={portfolio.attributes.name}
                      onDeleteIconClick={() => onDeleteIconClick(portfolio.id)}
                      onPortfolioClick={() => onPortfolioClick(portfolio.id)}
                    />
                  ))
                : null}
              <div className="addportfolio">
                <CgFolderAdd
                  className="addicon1"
                  onClick={openAddPortfolioPopup}
                />
              </div>
            </section>
          </Scrollbars>
        </main>
      </div>
      {isAddPortfolioPopupOpen ? (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeAddPortfolioPopup}
        >
          <AddPortfolio onClose={closeAddPortfolioPopup} />
        </PortalPopup>
      ) : null}
    </>
  );
};

export default Portfolios;
