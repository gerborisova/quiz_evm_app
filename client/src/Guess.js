import React, { useEffect, useState } from "react";
import "./Guess.scss";
import { ethers } from "ethers";
import confetti from "./assets/confetti.gif";
import { Link } from "react-router-dom";
import GuessForm from "./GuessForm";
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
    connectWallet();
  }, []);

  const { data, isError, isLoading } = useContractRead({});
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  // const question = useContractRead({
  //   address: contractAddress,
  //   abi: ABI,s
  //   scopeKey: "wagmi",
  //   functionName: "readQuestion",
  // });

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
      console.log(err.message.message);
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

  return (
    <div className="container">
      {activeConfetti ? (
        <img className="confetti" src={confetti} alt="confetti" />
      ) : null}
      <div className="info-wrap">
        <div className="info-items">
          <button className="guess-submit" onClick={(e) => chargeContract(e)}>
            Send ETH to Contract
          </button>
          <Link to="/create" className="create-btn">
            Create Quizz
          </Link>
          <div className="balance-info">
            <div>🤑You can win: {contractBalance} </div>
            <div>🤑 {userBalance} </div>
          </div>
          <GuessForm
            onSubmit={takeAGuess}
            setGuess={setGuess}
            wrongAnswer={wrongAnswer}
            correctAnswer={correctAnswer}
            question={question}
          />
        </div>
      </div>
    </div>
  );
}

export default Guess;
