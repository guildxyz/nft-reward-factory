import { ethers, upgrades } from "hardhat";

// CONFIG
const name = ""; // The name of the token.
const symbol = ""; // The short, usually all caps symbol of the token.
const cid = ""; // The cid that will be returned by the tokenURI.
const tokenOwner = "0x..."; /// The address that will be the owner of the deployed token.
const factoryAddress = "0x..."; /// The address of the proxy to be used when interacting with the factory.

async function main() {
  const GuildRewardNFT = await ethers.getContractFactory("GuildRewardNFT");
  const guildRewardNFT = await upgrades.deployProxy(GuildRewardNFT, [name, symbol, cid, tokenOwner, factoryAddress], {
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
