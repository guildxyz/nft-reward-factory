import { ethers, upgrades } from "hardhat";

const tokenAddress = "0x..."; // The address where the contract was deployed (proxy).

async function main() {
  const GuildRewardNFT = await ethers.getContractFactory("GuildRewardNFT");
  const guildRewardNFT = await upgrades.upgradeProxy(tokenAddress, GuildRewardNFT, {
    kind: "uups"
    // call: { fn: "reInitialize", args: [] }
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
