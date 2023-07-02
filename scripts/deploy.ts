import { ethers } from "hardhat";

async function main() {
  const answer = "mining";
  const salt = "salt";
  const question =
    "What is the process of validating and adding transactions to the blockchain called?";
  const quiz = await ethers.deployContract("Quizzes", [
    question,
    ethers.solidityPacked(["string", "string"], [answer, salt]),
    salt,
  ]);

  await quiz.waitForDeployment();

  console.log(`Quiz deployed to ${quiz.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
