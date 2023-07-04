import React, { useEffect, useState } from "react";
import "./Guess.scss";
import { ethers } from "ethers";
import confetti from "./assets/confetti.gif";
import { Link } from "react-router-dom";
import {
  ABI,
  factoryABI,
  factoryContractAddress,
  contractAddress,
} from "./utils";
import { useAccount, useConnect, useDisconnect, useContractRead } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function Guess() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  const [activeConfetti, setConfetti] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [guess, setGuess] = useState("");
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [contractBalance, setContractBalance] = useState(0);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    setCorrectAnswer(false);
    setWrongAnswer(false);
    setConfetti(false);
    connectWallet();
  }, []);

  const { data, isError, isLoading } = useContractRead({});
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const connectWallet = () => {
    provider
      .send("eth_requestAccounts", [])
      .then((result) => accountChange(result[0]))
      .catch((err) => console.log(err));
  };

  const accountChange = (accountName) => {
    getUserBalance(accountName);
    getContractBalance();
    getQuestion();
  };

  const getContractBalance = () => {
    provider
      .getBalance(contractAddress)
      .then((balance) => {
        setContractBalance(ethers.utils.formatEther(balance));
      })
      .catch((err) => console.log(err));
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
  const takeAGuess = async (e) => {
    e.preventDefault();
    setWrongAnswer(false);
    setCorrectAnswer(false);
    try {
      const takingGuess = await contract.guessAnswer(guess);
      await takingGuess.wait();
      setCorrectAnswer(true);
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
      }, "3000");
    } catch (err) {
      setWrongAnswer(true);
      console.log(err);
    }
  };

  const chargeContract = async (e) => {
    const options = { value: ethers.utils.parseEther("10") };
    e.preventDefault();
    try {
      const chargeContract = await contract.sendWei(options);
      await chargeContract.wait();
    } catch (err) {
      console.log(err);
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
      <div className="info-wrap">
        <div className="info-items">
          <div>🤑You can win: {contractBalance} </div>
          <button className="guess-submit" onClick={(e) => chargeContract(e)}>
            Send ETH to Contract
          </button>
          <div>🤑 {userBalance} </div>
          <div>🤔 {question}</div>
          <div className="utilities">
            <div className="guess-form">
              <p className="market-title"> Take a Guess 💰 </p>
              <form onSubmit={takeAGuess} className="form-items">
                <input onChange={handleInut} className="guess-input" />
                {wrongAnswer ? (
                  <div className="error-msg">Wrong answer</div>
                ) : (
                  <></>
                )}
                {correctAnswer ? (
                  <div className="correct-msg">Correct answer</div>
                ) : (
                  <></>
                )}
                <input type="submit" name="Guess" className="guess-submit" />
              </form>
            </div>
            <Link to="/create" className="create-btn">
              Create Quizz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guess;
