import { ethers } from "hardhat";

export async function main() {
  const QuizFactory = await ethers.getContractFactory("QuizFactory");
  const quizFactory = await QuizFactory.deploy();

  await quizFactory.waitForDeployment();

  console.log("Quiz factory deployed to", quizFactory.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
