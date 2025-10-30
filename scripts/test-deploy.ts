import { ethers } from "hardhat";

// CONFIG
const factoryAddress = "0x...";

const nftConfig = {
  name: "Test Guild NFT",
  symbol: "TGNFT",
  cid: "QmTest123",
  tokenOwner: "0x...",
  treasury: "0x...",
  tokenFee: 0,
  soulbound: true,
  maxSupply: 10,
  mintableAmountPerUser: 1
};

enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  const GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
  const factory = GuildRewardNFTFactory.attach(factoryAddress);

  const implementation = await factory.nftImplementations(ContractType.CONFIGURABLE_NFT);
  console.log("Implementation address:", implementation);

  const ConfigurableGuildRewardNFT = await ethers.getContractFactory("ConfigurableGuildRewardNFT");
  const implContract = ConfigurableGuildRewardNFT.attach(implementation);

  try {
    const factoryProxy = await implContract.factoryProxy();
    console.log("Implementation factoryProxy:", factoryProxy);

    if (factoryProxy === ethers.ZeroAddress) {
      console.log(
        "WARNING: Implementation contract has zero address for factoryProxy - it was probably initialized incorrectly!"
      );
    }
  } catch (error: any) {
    console.log("Error checking implementation:", error.message);
  }

  console.log("\nAttempting to deploy configurable NFT...");
  try {
    const tx = await factory.deployConfigurableNFT(nftConfig);
    console.log("Transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction successful! Gas used:", receipt?.gasUsed.toString());

    const event = receipt?.logs.find((log: any) => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed?.name === "RewardNFTDeployed";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = factory.interface.parseLog(event);
      console.log("Deployed NFT address:", parsed?.args.tokenAddress);
    }
  } catch (error: any) {
    console.error("Error deploying:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
