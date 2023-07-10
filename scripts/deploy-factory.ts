import { ethers, upgrades } from "hardhat";

// CONFIG
const name = ""; // The name of the token.
const symbol = ""; // The short, usually all caps symbol of the token.
const treasury = "0x..."; // The address where the collected fees will go.
const validSigner = "0x..."; // The address that signs the parameters for claiming tokens.
const cid = ""; // The cid that will be returned by the tokenURI.

async function main() {
  const GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
  const guildRewardNFTFactory = await upgrades.deployProxy(GuildRewardNFTFactory, [name, symbol, cid], {
    kind: "uups"
  });

  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contract to ${network.name !== "unknown" ? network.name : network.chainId}...`);
  console.log(`Tx hash: ${guildRewardNFTFactory.deploymentTransaction()?.hash}`);

  await guildRewardNFTFactory.waitForDeployment();

  console.log("GuildRewardNFT deployed to", await guildRewardNFTFactory.getAddress());

  await guildRewardNFTFactory.setTreasury(treasury);
  console.log(`Treasury set to ${treasury}`);

  await guildRewardNFTFactory.setValidSigner(validSigner);
  console.log(`ValidSigner set to ${validSigner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
