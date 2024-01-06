import { useState, useCallback } from "react";
import AddStock from "./AddStock";
import PortalPopup from "./PortalPopup";
import "./NavBar.css";
import { fetchStocks, deleteStock } from "../api/stocks.js";
import { useQuery } from "@tanstack/react-query";
import { CgAlignBottom, CgAddR, CgTrash, CgLogOut } from "react-icons/cg";
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

const Navbar = () => {
  const [token, setToken] = useCookies(["token"]);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/")[1];
  const { data: stocks } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => fetchStocks(token.token),
  });
  const queryClient = useQueryClient();

  const deleteStockMutation = useMutation({
    mutationFn: deleteStock,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });

  const [isAddStockPopupOpen, setAddStockPopupOpen] = useState(false);

  const onDeleteIconClick = (toDeleteId) => {
    if (toDeleteId == id) {
      navigate(-1);
    }
    const idToken = { id: toDeleteId, token: token.token };
    deleteStockMutation.mutate(idToken);
  };

  const openAddStockPopup = () => {
    setAddStockPopupOpen(true);
  };

  const closeAddStockPopup = () => {
    setAddStockPopupOpen(false);
  };

  const onLogoutClick = () => {
    navigate("/login");
  };

  return (
    <>
      <section className="navbar">
        <div className="sidebar">
          <div
            className="logo"
            onClick={() => {
              navigate("/home");
            }}
          >
            <div className="minilogo">
              <h3 className="logotext">FF</h3>
            </div>
            <b className="ferencfinance">FerencFinance</b>
          </div>
          <div className="main">
            <Scrollbars style={{ width: "100%", height: "100%" }}>
              <div className="stocks">
                {stocks
                  ? stocks.data.map((stock) => (
                      <button
                        key={stock.id}
                        className={
                          new RegExp(`^/${stock.id}(\/.*)?$`).test(
                            location.pathname
                          )
                            ? "selectedstock"
                            : "stock"
                        }
                      >
                        <Link
                          to={`/${stock.id}`}
                          key={stock.id}
                          className="navlink"
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            className={
                              new RegExp(`^/${stock.id}(\/.*)?$`).test(
                                location.pathname
                              )
                                ? "activeicon"
                                : "inactiveicon"
                            }
                          >
                            <CgAlignBottom className="stockicon" />
                          </div>
                          <div
                            className={
                              new RegExp(`^/${stock.id}(\/.*)?$`).test(
                                location.pathname
                              )
                                ? "selectedstockname"
                                : "stockname"
                            }
                            to={`/${stock.id}`}
                          >
                            {stock.attributes.ticker}
                          </div>
                        </Link>
                        <div
                          className={
                            new RegExp(`^/${stock.id}(\/.*)?$`).test(
                              location.pathname
                            )
                              ? "activeicon"
                              : "inactiveicon"
                          }
                        >
                          {" "}
                          <CgTrash
                            className="deleteicon"
                            onClick={() => onDeleteIconClick(stock.id)}
                          />
                        </div>
                      </button>
                    ))
                  : null}
              </div>
            </Scrollbars>

            <button className="addstock" onClick={openAddStockPopup}>
              <CgAddR className="stockicon" />
            </button>

            <button className="logout" onClick={onLogoutClick}>
              <CgLogOut className="logouticon" />
              <div className="iconstockname">Logout</div>
            </button>
          </div>
        </div>
      </section>
      <Outlet />
      {isAddStockPopupOpen ? (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeAddStockPopup}
        >
          <AddStock onClose={closeAddStockPopup} />
        </PortalPopup>
      ) : null}
    </>
  );
};

export default Navbar;
