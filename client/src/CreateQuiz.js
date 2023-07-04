import React, { useEffect, useState } from "react";
import "./Guess.scss";
import { ethers } from "ethers";
import confetti from "./assets/confetti.gif";
import {
  ABI,
  factoryABI,
  factoryContractAddress,
  contractAddress,
} from "./utils";

import GuessForm from "./GuessForm";

function CreateQuiz() {
  const [contracts, setQuizzContracts] = useState([]);
  const [guess, setGuess] = useState("");
  const [activeConfetti, setConfetti] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [currentKey, setCurrentKey] = useState();
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [createQuestion, setCreateQuestion] = useState();
  const [createAnswer, setCreateAnswer] = useState();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factoryContract = new ethers.Contract(
    factoryContractAddress,
    factoryABI,
    signer
  );

  const createQuiz = async (e) => {
    e.preventDefault();
    try {
      const results = await factoryContract.createQuiz(
        createQuestion,
        createAnswer
      );
    } catch (err) {
      console.log("e", err);
    }
  };

  const getQuizzesFromFactory = async () => {
    setQuizzContracts([]);
    setQuestions([]);
    try {
      const addresses = await factoryContract.getCreatedQuizzes();
      callContract(addresses);
    } catch (err) {
      console.log("e", err);
    }
  };

  const callContract = (addresses) => {
    addresses.forEach((address) => {
      const quizContract = new ethers.Contract(address, ABI, signer);
      setQuizzContracts((contracts) => [...contracts, quizContract]);
      getQuestion(quizContract);
    });
  };

  const getQuestion = async (quizContract) => {
    try {
      const question = await quizContract.readQuestion();
      setQuestions((questions) => [...questions, question]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const takeAGuess = async (e, key) => {
    e.preventDefault();
    setCurrentKey(key);
    setWrongAnswer(false);
    setCorrectAnswer(false);
    try {
      const takingGuess = await contracts[currentKey].guessAnswer(guess);
      await takingGuess.wait();
      setCorrectAnswer(true);
      setTimeout(() => {
        setConfetti(false);
      }, "3000");
    } catch (err) {
      setWrongAnswer(true);
      console.log(err.message.message);
    }
  };
  const handleQuestion = (e) => {
    setCreateQuestion(e.target.value);
  };

  const handleAnswer = (e) => {
    setCreateAnswer(e.target.value);
  };

  return (
    <div className="container">
      {activeConfetti ? (
        <img className="confetti" src={confetti} alt="confetti" />
      ) : null}
      <div className="info-wrap">
        <div className="info-items">
          <div className="utilities">
            <div className="create-form">
              <p className="market-title"> Generate Quiz </p>
              <form onSubmit={createQuiz} className="form-items">
                <input
                  onChange={handleQuestion}
                  className="guess-input"
                  placeholder="Question"
                />
                <input
                  onChange={handleAnswer}
                  className="guess-input"
                  placeholder="Answer"
                />
                <input type="submit" name="Create" className="guess-submit" />
                <button
                  className="guess-submit"
                  onClick={() => getQuizzesFromFactory()}
                >
                  Generate Quizzes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="info-wrap">
        <div className="info-items">
          <p>Created Quizzes</p>
          {questions.map((question, key) => (
            <GuessForm
              currentKey={key}
              onSubmit={(e) => takeAGuess(e, key)}
              setGuess={setGuess}
              question={question}
              correctAnswer={correctAnswer}
              wrongAnswer={wrongAnswer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;
