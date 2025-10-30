import { ethers } from "hardhat";

const factoryAddress = "0x...";

enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}

async function main() {
  const GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
  const factory = GuildRewardNFTFactory.attach(factoryAddress);

  console.log("Factory Setup Verification");
  console.log("=========================\n");

  const owner = await factory.owner();
  console.log("Factory Owner:", owner);

  const validSigner = await factory.validSigner();
  console.log("Valid Signer:", validSigner);

  const treasury = await factory.treasury();
  const fee = await factory.fee();
  console.log("Treasury:", treasury);
  console.log("Fee:", ethers.formatEther(fee), "ETH");

  const basicImpl = await factory.nftImplementations(ContractType.BASIC_NFT);
  const configurableImpl = await factory.nftImplementations(ContractType.CONFIGURABLE_NFT);

  console.log("\nImplementations:");
  console.log("Basic NFT:", basicImpl);
  console.log("Configurable NFT:", configurableImpl);

  if (configurableImpl === ethers.ZeroAddress) {
    console.log("❌ Configurable NFT implementation not set!");
  } else {
    console.log("\nVerifying Configurable Implementation...");
    const ConfigurableGuildRewardNFT = await ethers.getContractFactory("ConfigurableGuildRewardNFT");
    const impl = ConfigurableGuildRewardNFT.attach(configurableImpl);

    try {
      const implFactoryProxy = await impl.factoryProxy();
      console.log("Implementation factoryProxy:", implFactoryProxy);

      if (implFactoryProxy === ethers.ZeroAddress) {
        console.log("✓ Implementation is uninitialized (CORRECT for minimal proxy pattern)");
      } else {
        console.log("⚠ WARNING: Implementation is initialized (might cause issues with clones)");
      }
    } catch (error) {
      console.log("⚠ Could not check implementation state");
    }
  }

  console.log("\n✓ Factory setup verification complete");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
