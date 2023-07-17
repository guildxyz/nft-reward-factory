import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

/// NFT CONFIG
const sampleGuildId = 1985;
const sampleName = "Test Guild Passport";
const sampleSymbol = "TGP";
const cids = ["QmPaZD7i8TpLEeGjHtGoXe4mPKbRNNt8YTHH5nrKoqz9wJ", "QmcaGypWsmzaSQQGuExUjtyTRvZ2FF525Ww6PBNWWgkkLj"];

// CONTRACTS
let GuildRewardNFTFactory: ContractFactory;
let GuildRewardNFT: ContractFactory;
let factory: Contract;
let nftMain: Contract;

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
    factory = await upgrades.deployProxy(GuildRewardNFTFactory, [treasury.address, signer.address], {
      kind: "uups"
    });
    await factory.waitForDeployment();

    GuildRewardNFT = await ethers.getContractFactory("GuildRewardNFT");
    // nftMain = await upgrades.deployProxy(GuildRewardNFT, ["Test NFT", "TNFT", "cid", await factory.getAddress()], {
    //   kind: "uups"
    // });
    nftMain = (await GuildRewardNFT.deploy()) as Contract;
    await nftMain.waitForDeployment();
    await nftMain.initialize("Test NFT", "TNFT", "cid", await factory.getAddress());

    await factory.setNFTImplementation(nftMain);
  });

  it("should be upgradeable", async () => {
    const upgraded = await upgrades.upgradeProxy(factory, GuildRewardNFTFactory, {
      kind: "uups"
      // call: { fn: "reInitialize", args: [] }
    });

    expect(await upgraded.treasury()).to.eq(treasury.address);
    expect(await upgraded.validSigner()).to.eq(signer.address);
    // expect(await upgraded.owner()).to.eq(wallet0.address);
  });

  it("should deploy and initialize clones", async () => {
    await factory.clone(sampleGuildId, sampleName, sampleSymbol, cids[0]);
    const nftAddress = await factory.deployedTokenContracts(sampleGuildId);
    const nft = new Contract(nftAddress, nftMain.interface, wallet0);
    expect(await nft.name()).to.eq(sampleName);
    expect(await nft.symbol()).to.eq(sampleSymbol);
    expect(await nft.validSigner()).to.eq(signer.address);
  });

  it("should emit RewardNFTDeployed event", async () => {
    await expect(factory.clone(sampleGuildId, sampleName, sampleSymbol, cids[0]))
      .to.emit(factory, "RewardNFTDeployed")
      .withArgs(sampleGuildId, anyValue);
  });

  context("#setValidSigner", () => {
    it("should revert if the valid signer is attempted to be changed by anyone but the owner", async () => {
      await expect((factory.connect(randomWallet) as Contract).setValidSigner(randomWallet.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should change the valid signer's address", async () => {
      const validSigner0 = await factory.validSigner();
      await factory.setValidSigner(randomWallet.address);
      const validSigner1 = await factory.validSigner();
      expect(validSigner1).to.not.eq(validSigner0);
      expect(validSigner1).to.eq(randomWallet.address);
    });

    it("should emit ValidSignerChanged event", async () => {
      await expect(factory.setValidSigner(randomWallet.address))
        .to.emit(factory, "ValidSignerChanged")
        .withArgs(randomWallet.address);
    });
  });
});
