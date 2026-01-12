const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Ecommerce = await ethers.getContractFactory("Web3Ecommerce");

  console.log("Deploying Ecommerce contract...");
  const ecommerce = await Ecommerce.deploy();

  await ecommerce.waitForDeployment();

  console.log("Ecommerce contract deployed to:", ecommerce.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});