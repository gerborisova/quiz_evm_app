import React, { useEffect, useState } from "react";
import "./Guess.scss";
import { ethers } from "ethers";
import {
  ABI,
  factoryABI,
  factoryContractAddress,
  contractAddress,
} from "./utils";

function CreateQuiz() {
  const [guess, setGuess] = useState("");
  const [quizzes, setQuizzes] = useState();
  const [createQuestion, setCreateQuestion] = useState();
  const [createAnswer, setCreateAnswer] = useState();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factoryContract = new ethers.Contract(
    factoryContractAddress,
    factoryABI,
    signer
  );

  provider.once("block", () => {
    factoryContract.on("QuizCreated", (quiz) => {
      console.log("quiz:", quiz);
      getQuizzesFromFactory();
    });
  });

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
    try {
      const results = await factoryContract.getCreatedQuizzes();
      await results.wait();
      console.log("quizzes", results);
      setQuizzes(results);
    } catch (err) {
      console.log("e", err);
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
    </div>
  );
}

export default CreateQuiz;
