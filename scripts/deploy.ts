import { ethers } from "hardhat";

async function main() {
  const answer = "two";
  const salt = "salt";
  const quiz = await ethers.deployContract("Quizzes", [
    "one",
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
