import { ethers } from "hardhat";

// CONFIG
const factoryAddress = "0x..."; /// The address of the proxy to be used when interacting with the factory.
// Note: the values below are just some defaults. The values in clones will truly matter.
const name = ""; // The name of the token.
const symbol = ""; // The short, usually all caps symbol of the token.
const cid = ""; // The cid that will be returned by the tokenURI.
const tokenOwner = "0x..."; /// The address that will be the owner of the deployed token.
const treasury = "0x..."; // The address that will receive the price paid for mints.
const tokenFee = 0; // The price of every mint in wei.

async function main() {
  const contractName = "BasicGuildRewardNFT";

  const BasicGuildRewardNFT = await ethers.getContractFactory(contractName);
  const basicGuildRewardNFT = await BasicGuildRewardNFT.deploy();

  const network = await ethers.provider.getNetwork();
  console.log(`Deploying ${contractName} to ${network.name !== "unknown" ? network.name : network.chainId}...`);
  console.log(`Tx hash: ${basicGuildRewardNFT.deploymentTransaction()?.hash}`);

  await basicGuildRewardNFT.waitForDeployment();

  await basicGuildRewardNFT.initialize(name, symbol, cid, tokenOwner, treasury, tokenFee, factoryAddress);

  console.log(`${contractName} deployed to:`, await basicGuildRewardNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
