import { ethers, upgrades } from "hardhat";

// CONFIG
const name = ""; // The name of the token.
const symbol = ""; // The short, usually all caps symbol of the token.
const treasury = "0x..."; // The address where the collected fees will go.
const validSigner = "0x..."; // The address that signs the parameters for claiming tokens.
const cid = "0x..."; // The cid that will be returned by the tokenURI.

async function main() {
  const GuildRewardNFT = await ethers.getContractFactory("GuildRewardNFT");
  const guildRewardNFT = await upgrades.deployProxy(GuildRewardNFT, [name, symbol, treasury, validSigner, cid], {
    kind: "uups"
  });

  const network = await ethers.provider.getNetwork();
  console.log(`Deploying contract to ${network.name !== "unknown" ? network.name : network.chainId}...`);
  console.log(`Tx hash: ${guildRewardNFT.deploymentTransaction()?.hash}`);

  await guildRewardNFT.waitForDeployment();

  console.log("GuildRewardNFT deployed to:", await guildRewardNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
