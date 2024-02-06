import { ethers, upgrades } from "hardhat";

const factoryAddress = "0x..."; // The address where the contract was deployed (proxy).

async function main() {
  const contractName = "GuildRewardNFTFactory";

  const GuildRewardNFTFactory = await ethers.getContractFactory(contractName);
  const guildRewardNFTFactory = await upgrades.upgradeProxy(factoryAddress, GuildRewardNFTFactory, {
    kind: "uups",
    unsafeSkipStorageCheck: true
    // call: { fn: "reInitialize", args: [] }
  });

  const network = await ethers.provider.getNetwork();
  console.log(`Upgrading ${contractName} on ${network.name !== "unknown" ? network.name : network.chainId}...`);

  await guildRewardNFTFactory.waitForDeployment();

  console.log(`${contractName} upgraded to:`, await guildRewardNFTFactory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
