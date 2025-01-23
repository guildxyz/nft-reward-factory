import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as hre from "hardhat";
import { ethers } from "hardhat";
import { Wallet } from "zksync-ethers";

enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}

const factoryAddress = "0x..."; // The address of the proxy used when interacting with the factory.
const nftType = ContractType.CONFIGURABLE_NFT; // The type of the contract.
const nftAddress = "0x..."; // The address where the above type of nft was deployed.

async function main() {
  const zkWallet = new Wallet(process.env.PRIVATE_KEY!);
  const deployer = new Deployer(hre, zkWallet);

  const GuildRewardNFTFactory = await hre.artifacts.readArtifact("GuildRewardNFTFactory");
  const factory = new ethers.Contract(factoryAddress, GuildRewardNFTFactory.abi, deployer.zkWallet);
  await factory.setNFTImplementation(nftType, nftAddress);
  console.log(`NFT implementation linked to the factory`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
