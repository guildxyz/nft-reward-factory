import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

// CONTRACTS
let GuildRewardNFT: ContractFactory;
let nft: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;

const sampleUrlName = "reward-test";

describe("GuildRewardNFTFactory", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet] = await ethers.getSigners();
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFT = await ethers.getContractFactory("GuildRewardNFT");
    nft = await upgrades.deployProxy(
      GuildRewardNFT,
      ["GuildRewardNFTFactoryTestNFT", "GRFT", randomWallet.address, randomWallet.address, "cid"],
      {
        kind: "uups"
      }
    );
    await nft.waitForDeployment();
  });

  it("should be upgradeable", async () => {
    const upgraded = await upgrades.upgradeProxy(nft, GuildRewardNFT, {
      kind: "uups"
      // call: { fn: "reInitialize", args: [] }
    });

    expect(await upgraded.owner()).to.eq(wallet0.address);
  });

  it("should deploy clones", async () => {
    await nft.clone(sampleUrlName);
  });

  it("should emit RewardNFTDeployed event", async () => {
    await expect(nft.clone(sampleUrlName)).to.emit(nft, "RewardNFTDeployed").withArgs(sampleUrlName, anyValue);
  });
});
