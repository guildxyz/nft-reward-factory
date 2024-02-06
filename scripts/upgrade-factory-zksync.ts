import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet } from "zksync-ethers";

import * as hre from "hardhat";

const factoryAddress = "0x..."; // The address where the contract was deployed (proxy).

async function main() {
  const contractName = "GuildRewardNFTFactory";

  const zkWallet = new Wallet(process.env.PRIVATE_KEY!);
  const deployer = new Deployer(hre, zkWallet);

  const GuildRewardNFTFactory = await deployer.loadArtifact(contractName);
  const guildRewardNFTFactory = await hre.zkUpgrades.upgradeProxy(
    deployer.zkWallet,
    factoryAddress,
    GuildRewardNFTFactory,
    {
      // call: { fn: "reInitialize", args: [] }
    }
  );

  console.log(`Upgrading ${contractName} on zkSync...`);

  await guildRewardNFTFactory.waitForDeployment();

  console.log(`${contractName} upgraded to:`, await guildRewardNFTFactory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
