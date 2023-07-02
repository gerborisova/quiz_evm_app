import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { ethers } from "ethers";
import logo from "./assets/logo.gif";
import confetti from "./assets/confetti.gif";
import { ABI, contractAddress } from "./utils";

function Profile() {
  const [activeConfetti, setConfetti] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [guess, setGuess] = useState("");
  const [defaultAccount, setDefaultAccount] = useState(
    "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
  );

  const [question, setQuestion] = useState("");

  const abi = ABI;
  const address = contractAddress;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = () => {
    provider
      .send("eth_requestAccounts", [])
      .then((result) => accountChange(result[0]))
      .catch((err) => console.log(err));
  };

  const accountChange = (accountName) => {
    setDefaultAccount(accountName);
    getUserBalance(accountName);
    getQuestion();
  };

  const getUserBalance = (accountAddress) => {
    provider
      .getBalance(accountAddress)
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((err) => console.log(err));
  };

  const getQuestion = async () => {
    try {
      const question = await contract.readQuestion();
      setQuestion(question);
    } catch (err) {
      console.log(err.message);
    }
  };

  const takeAGuess = async (e, guess) => {
    e.preventDefault();
    try {
      const takingGuess = await contract.guessAnswer(guess);
      await takingGuess.wait();
    } catch (err) {
      console.log(err.data);
    }
  };

  const handleInut = (e) => {
    setGuess(e.target.value);
  };

  return (
    <div className="container">
      {activeConfetti ? (
        <img className="confetti" src={confetti} alt="confetti" />
      ) : null}
      <div className="image-wrap">
        <img className="profile-logo" src={logo} alt="logo" />
      </div>
      <div className="info-wrap">
        <div className="info-items">
          <div>🤑 {userBalance} </div>
          <div>🤔 {question}</div>
          <div className="utilities">
            <div className="guess-form">
              <p className="market-title"> Take a Guess 💰 </p>
              <form onSubmit={takeAGuess} className="form-items">
                <input onChange={handleInut} className="guess-input" />
                <input type="submit" name="Guess" className="guess-submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
