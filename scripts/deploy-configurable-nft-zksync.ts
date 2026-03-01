import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import "dotenv/config";
import * as hre from "hardhat";
import { Wallet } from "zksync-ethers";

// CONFIG
const factoryAddress = "0x..."; // The address of the proxy to be used when interacting with the factory.
// Note: the values below are just some defaults. The values in clones will truly matter.
const nftConfig = {
  name: "", // The name of the token.
  symbol: "", // The short, usually all caps symbol of the token.
  cid: "", // The cid that will be returned by the tokenURI.
  tokenOwner: "0x...", // The address that will be the owner of the deployed token.
  treasury: "0x...", // The address that will receive the price paid for mints.
  tokenFee: 0, // The price of every mint in wei.
  soulbound: true, // Whether the token should be soulbound or not.
  maxSupply: 10, // The maximum number of tokens that users will ever be able to mint.
  mintableAmountPerUser: 1 // The maximum amount a user will be able to mint from the token.
};

enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}

async function main() {
  const contractName = "ConfigurableGuildRewardNFT";

  const zkWallet = new Wallet(process.env.PRIVATE_KEY!);

  const deployer = new Deployer(hre, zkWallet);

  const contract = await deployer.loadArtifact(contractName);
  const configurableGuildRewardNFT = await deployer.deploy(contract);

  console.log(`Deploying ${contractName} to zkSync...`);
  console.log(`Tx hash: ${configurableGuildRewardNFT.deploymentTransaction()?.hash}`);

  await configurableGuildRewardNFT.waitForDeployment();

  await configurableGuildRewardNFT.initialize(nftConfig, factoryAddress);

  const nftAddress = await configurableGuildRewardNFT.getAddress();
  console.log(`${contractName} deployed to:`, nftAddress);

  const GuildRewardNFTFactory = await hre.artifacts.readArtifact("GuildRewardNFTFactory");
  const factory = new hre.ethers.Contract(factoryAddress, GuildRewardNFTFactory.abi, deployer.zkWallet);
  await factory.setNFTImplementation(ContractType.CONFIGURABLE_NFT, nftAddress);
  console.log(`${contractName} implementation linked to the factory`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
