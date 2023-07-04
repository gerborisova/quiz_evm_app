import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Quizzess", function () {
  async function deployQuiz() {
    const salt = "salt";
    const answer = "two";
    const Quizzes = await ethers.getContractFactory("Quizzes");
    const quiz = await Quizzes.deploy(
      "one",
      ethers.solidityPacked(["string", "string"], [answer, salt]),
      salt,
      {
        value: 20,
      }
    );
    const [owner, otherAccount] = await ethers.getSigners();

    return { quiz, owner, otherAccount };
  }
  async function deployQuizWithNoBalance() {
    const salt = "salt";
    const answer = "two";
    const Quizzes = await ethers.getContractFactory("Quizzes");
    const quizNoBalance = await Quizzes.deploy(
      "one",
      ethers.solidityPacked(["string", "string"], [answer, salt]),
      salt
    );
    return { quizNoBalance };
  }
  it("Should show the question", async function () {
    const { quiz } = await loadFixture(deployQuiz);
    expect(await quiz.readQuestion()).to.equal("one");
  });
  it("Should return error on wrong answer", async function () {
    const { quiz } = await loadFixture(deployQuiz);
    await expect(quiz.guessAnswer("wrong")).to.be.revertedWith("Wrong answer");
  });
  it("Should emit the correct answer event", async function () {
    const { quiz } = await loadFixture(deployQuiz);
    await expect(quiz.guessAnswer("two")).to.emit(quiz, "CorrectGuess");
  });
  it("Should transfer money", async function () {
    const { quiz } = await loadFixture(deployQuiz);
    await quiz.guessAnswer("two");
    const userBalance = await quiz.getBalance();
    expect(userBalance).to.be.equal(0);
  });
  it("Should emit NotEnoughBalance() ", async function () {
    const { quizNoBalance } = await loadFixture(deployQuizWithNoBalance);
    await quizNoBalance.guessAnswer("two");
    await expect(quizNoBalance.guessAnswer("two")).to.emit(
      quizNoBalance,
      "NotEnoughBalance"
    );
  });
  it("Should execute fallback ", async function () {
    const { quiz, owner } = await loadFixture(deployQuiz);
    await expect(
      owner.sendTransaction({
        data: "0x123456789123",
        to: quiz.getAddress(),
        value: 10,
      })
    ).to.emit(quiz, "TransactionAttempt");
  });
  it("Should execute receive ", async function () {
    const { quiz, owner } = await loadFixture(deployQuiz);
    await expect(
      owner.sendTransaction({
        to: quiz.getAddress(),
        value: 10,
      })
    ).to.emit(quiz, "TransactionAttempt");
  });
});
