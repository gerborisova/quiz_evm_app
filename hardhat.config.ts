import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";

const lazyImport = async (module: any) => {
  return await import(module);
};

task("deploy", "Deploy the factory contract").setAction(async () => {
  const { main } = await lazyImport("./scripts/deploy-quiz-factory.ts");
  await main();
});

const config: HardhatUserConfig = {
  solidity: "0.8.18",
};

export default config;
