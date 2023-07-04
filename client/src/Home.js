import logo from "./assets/logo.gif";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./Home.scss";

function Home() {
  const navigate = useNavigate();
  const navigateToProfile = () => {
    navigate("/guess");
  };
  return (
    <div className="App">
      <header className="header">
        <h1 className="app-title">Do you want to win some ETH?</h1>
        <img className="logo" src={logo} alt="logo" />
        <button className="connect-btn" onClick={() => navigateToProfile()}>
          CONNECT WALLET
        </button>
      </header>
    </div>
  );
}

export default Home;
