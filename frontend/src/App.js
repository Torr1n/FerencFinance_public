import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Route,
  Routes,
  useNavigationHome,
  useLocation,
  BrowserRouter,
} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/NavBar";
import SelectedStock from "./components/SelectedStock";
import SignIn from "./components/SignIn";
import HomePage from "./components/HomePage";
import { CookiesProvider } from "react-cookie";

const queryClient = new QueryClient();

function App() {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<SignIn />} />
            <Route path="/" element={<Navbar />}>
              <Route index element={<HomePage />} />
              <Route path=":id" element={<SelectedStock />} />
              <Route path=":id/:period" element={<SelectedStock />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
