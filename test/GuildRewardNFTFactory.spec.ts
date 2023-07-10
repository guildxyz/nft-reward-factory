import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

/// NFT CONFIG
const sampleUrlName = "reward-test";
const sampleName = "Test Guild Passport";
const sampleSymbol = "TGP";
const cids = ["QmPaZD7i8TpLEeGjHtGoXe4mPKbRNNt8YTHH5nrKoqz9wJ", "QmcaGypWsmzaSQQGuExUjtyTRvZ2FF525Ww6PBNWWgkkLj"];

// CONTRACTS
let GuildRewardNFTFactory: ContractFactory;
let factory: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;
let treasury: SignerWithAddress;
let signer: SignerWithAddress;

describe("GuildRewardNFTFactory", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet, treasury, signer] = await ethers.getSigners();
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
    factory = await upgrades.deployProxy(GuildRewardNFTFactory, ["Factory", "F", "cid"], {
      kind: "uups"
    });
    await factory.waitForDeployment();

    await factory.setValidSigner(signer);
    await factory.setTreasury(treasury);
  });

  it("should be upgradeable", async () => {
    const upgraded = await upgrades.upgradeProxy(factory, GuildRewardNFTFactory, {
      kind: "uups"
      // call: { fn: "reInitialize", args: [] }
    });

    expect(await upgraded.owner()).to.eq(wallet0.address);
  });

  it("should deploy and initialize clones", async () => {
    await factory.clone(sampleUrlName, sampleName, sampleSymbol, cids[0]);
    const nftAddress = await factory.deployedTokenContracts(sampleUrlName);
    console.log("ts: ", nftAddress);
    const nft = new Contract(nftAddress, factory.interface, wallet0);
    expect(await nft.name()).to.eq(sampleName);
    expect(await nft.symbol()).to.eq(sampleSymbol);
    expect(await nft.treasury()).to.eq(treasury.address);
    expect(await nft.validSigner()).to.eq(signer.address);
  });

  it("should emit RewardNFTDeployed event", async () => {
    await expect(factory.clone(sampleUrlName, sampleName, sampleSymbol, cids[0]))
      .to.emit(factory, "RewardNFTDeployed")
      .withArgs(sampleUrlName, anyValue);
  });
});
