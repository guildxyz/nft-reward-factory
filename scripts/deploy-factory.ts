import { ethers, upgrades } from "hardhat";

// CONFIG
const treasury = "0x..."; // The address where the collected fees will go.
const fee = 0; // The Guild base fee for every deployment.
const validSigner = "0x..."; // The address that signs the parameters for claiming tokens.
// Note: set NFT implementation after deploying the NFTs.

async function main() {
  const contractName = "GuildRewardNFTFactory";

  const GuildRewardNFTFactory = await ethers.getContractFactory(contractName);
  const guildRewardNFTFactory = await upgrades.deployProxy(GuildRewardNFTFactory, [treasury, fee, validSigner], {
    kind: "uups"
  });

  const network = await ethers.provider.getNetwork();
  console.log(`Deploying ${contractName} to ${network.name !== "unknown" ? network.name : network.chainId}...`);
  console.log(`Tx hash: ${guildRewardNFTFactory.deploymentTransaction()?.hash}`);

  await guildRewardNFTFactory.waitForDeployment();

  console.log(`${contractName} deployed to:`, await guildRewardNFTFactory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
