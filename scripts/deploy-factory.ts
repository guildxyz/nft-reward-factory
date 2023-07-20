import { ethers, upgrades } from "hardhat";

// CONFIG
const treasury = "0x..."; // The address where the collected fees will go.
const validSigner = "0x..."; // The address that signs the parameters for claiming tokens.
// Note: set NFT implementation after deploying the NFT itself (deploy-nft.ts).

async function main() {
  const GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
  const guildRewardNFTFactory = await upgrades.deployProxy(GuildRewardNFTFactory, [treasury, validSigner], {
    kind: "uups"
  });

  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contract to ${network.name !== "unknown" ? network.name : network.chainId}...`);
  console.log(`Tx hash: ${guildRewardNFTFactory.deploymentTransaction()?.hash}`);

  await guildRewardNFTFactory.waitForDeployment();

  console.log("GuildRewardNFTFactory deployed to", await guildRewardNFTFactory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
