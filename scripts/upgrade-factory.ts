import { ethers, upgrades } from "hardhat";

const factoryAddress = "0x..."; // The address where the contract was deployed (proxy).

async function main() {
  const GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
  const guildRewardNFTFactory = await upgrades.upgradeProxy(factoryAddress, GuildRewardNFTFactory, {
    kind: "uups",
    unsafeSkipStorageCheck: true
    // call: { fn: "reInitialize", args: [] }
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
