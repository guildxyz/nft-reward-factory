import { ethers } from "hardhat";

enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}

const factoryAddress = "0x..."; // The address of the proxy used when interacting with the factory.
const nftType = ContractType.CONFIGURABLE_NFT; // The type of the contract.
const nftAddress = "0x..."; // The address where the above type of nft was deployed.

async function main() {
  const GuildPin = await ethers.getContractFactory("GuildRewardNFTFactory");
  const pin = GuildPin.attach(factoryAddress);

  await pin.setNFTImplementation(nftType, nftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
