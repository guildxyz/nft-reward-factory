import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import "dotenv/config";
import * as hre from "hardhat";
import { Wallet } from "zksync-ethers";

// CONFIG
const treasury = "0x..."; // The address where the collected fees will go.
const fee = 0; // The Guild base fee for every deployment.
const validSigner = "0x..."; // The address that signs the parameters for claiming tokens.
// Note: set NFT implementation after deploying the NFT itself (deploy-nft.ts).

async function main() {
  const contractName = "GuildRewardNFTFactory";

  const zkWallet = new Wallet(process.env.PRIVATE_KEY!);

  const deployer = new Deployer(hre, zkWallet);

  const contract = await deployer.loadArtifact(contractName);
  const guildRewardNFTFactory = await hre.zkUpgrades.deployProxy(
    deployer.zkWallet,
    contract,
    [treasury, fee, validSigner],
    {
      initializer: "initialize"
    }
  );

  console.log(`Deploying ${contractName} to zkSync...`);
  console.log(`Tx hash: ${guildRewardNFTFactory.deploymentTransaction()?.hash}`);

  await guildRewardNFTFactory.waitForDeployment();

  console.log(`${contractName} deployed to:`, await guildRewardNFTFactory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
