import React, { useEffect, useState } from "react";
import "./Guess.scss";

function GuessForm(props) {
  const {
    onSubmit,
    setGuess,
    question,
    wrongAnswer,
    correctAnswer,
    currentKey,
  } = props;

  const handleInut = (e) => {
    setGuess(e.target.value);
  };

  return (
    <div className="container">
      <div className="utilities">
        <div className="guess-form">
          <p className="market-title">🤔 {question}</p>
          <form onSubmit={onSubmit} className="form-items">
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
      </div>
    </div>
  );
}

export default GuessForm;
