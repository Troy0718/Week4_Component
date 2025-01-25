import { useState } from "react";
import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";

const url = import.meta.env.VITE_URL;
const path = import.meta.env.VITE_PATH;
function App() {
  const [isAuth, setisAuth] = useState(false);
  return (
    <>
      {isAuth ? (
        <ProductPage setisAuth={setisAuth} />
      ) : (
        <LoginPage setisAuth={setisAuth} />
      )}
    </>
  );
}

export default App;
