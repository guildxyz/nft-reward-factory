import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

// NFT CONFIG
const sampleName = "Test Guild Passport";
const sampleSymbol = "TGP";
const cids = ["QmPaZD7i8TpLEeGjHtGoXe4mPKbRNNt8YTHH5nrKoqz9wJ", "QmcaGypWsmzaSQQGuExUjtyTRvZ2FF525Ww6PBNWWgkkLj"];
const sampleFee = 69;
const sampleSoulbound = true;
const sampleMintableAmountPerUser = 1;

// CONTRACTS
let GuildRewardNFTFactory: ContractFactory;
let factory: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;
let treasury: SignerWithAddress;
let signer: SignerWithAddress;

enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}

describe("GuildRewardNFTFactory", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet, treasury, signer] = await ethers.getSigners();
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
    factory = await upgrades.deployProxy(GuildRewardNFTFactory, [treasury.address, 1, signer.address], {
      kind: "uups"
    });
    await factory.waitForDeployment();
  });

  it("should be upgradeable", async () => {
    const upgraded = await upgrades.upgradeProxy(factory, GuildRewardNFTFactory, {
      kind: "uups"
      // call: { fn: "reInitialize", args: [] }
    });

    expect(await upgraded.treasury()).to.eq(treasury.address);
    expect(await upgraded.validSigner()).to.eq(signer.address);
    expect(await upgraded.owner()).to.eq(wallet0.address);
  });

  it("should deploy and initialize clones of BasicGuildRewardNFT", async () => {
    const basicGuildRewardNFT = await ethers.getContractFactory("BasicGuildRewardNFT");
    const nftMain = (await basicGuildRewardNFT.deploy()) as Contract;
    await nftMain.waitForDeployment();
    await factory.setNFTImplementation(ContractType.BASIC_NFT, nftMain);

    await factory.deployBasicNFT(sampleName, sampleSymbol, cids[0], randomWallet.address, treasury.address, sampleFee);
    const nftAddresses = await factory.getDeployedTokenContracts(wallet0.address);
    const nft = nftMain.attach(nftAddresses[0].contractAddress) as Contract;
    expect(await nft.name()).to.eq(sampleName);
    expect(await nft.symbol()).to.eq(sampleSymbol);
    expect(await nft.owner()).to.eq(randomWallet.address);
    expect(await nft.fee()).to.eq(sampleFee);
  });

  it("should deploy and initialize clones of ConfigurableGuildRewardNFT", async () => {
    const configurableGuildRewardNFT = await ethers.getContractFactory("ConfigurableGuildRewardNFT");
    const nftMain = (await configurableGuildRewardNFT.deploy()) as Contract;
    await nftMain.waitForDeployment();
    await factory.setNFTImplementation(ContractType.CONFIGURABLE_NFT, nftMain);

    await factory.deployConfigurableNFT({
      name: sampleName,
      symbol: sampleSymbol,
      cid: cids[0],
      tokenOwner: randomWallet.address,
      treasury: treasury.address,
      tokenFee: sampleFee,
      soulbound: sampleSoulbound,
      mintableAmountPerUser: sampleMintableAmountPerUser
    });
    const nftAddresses = await factory.getDeployedTokenContracts(wallet0.address);
    const nft = nftMain.attach(nftAddresses[0].contractAddress) as Contract;
    expect(await nft.name()).to.eq(sampleName);
    expect(await nft.symbol()).to.eq(sampleSymbol);
    expect(await nft.owner()).to.eq(randomWallet.address);
    expect(await nft.fee()).to.eq(sampleFee);
    expect(await nft.mintableAmountPerUser()).to.eq(sampleMintableAmountPerUser);
  });

  it("should emit RewardNFTDeployed event", async () => {
    await expect(factory.deployBasicNFT(sampleName, sampleSymbol, cids[0], wallet0.address, treasury.address, 0))
      .to.emit(factory, "RewardNFTDeployed")
      .withArgs(wallet0.address, anyValue, ContractType.BASIC_NFT);
  });

  context("#setNFTImplementation", () => {
    it("should revert if an implementation is attempted to be changed by anyone but the owner", async () => {
      await expect(
        (factory.connect(randomWallet) as Contract).setNFTImplementation(ContractType.BASIC_NFT, randomWallet.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should change an implementation's address", async () => {
      const impl0 = await factory.nftImplementations(ContractType.BASIC_NFT);
      await factory.setNFTImplementation(ContractType.BASIC_NFT, randomWallet.address);
      const impl1 = await factory.nftImplementations(ContractType.BASIC_NFT);
      expect(impl1).to.not.eq(impl0);
      expect(impl1).to.eq(randomWallet.address);
    });

    it("should emit ImplementationChanged event", async () => {
      await expect(factory.setNFTImplementation(ContractType.BASIC_NFT, randomWallet.address))
        .to.emit(factory, "ImplementationChanged")
        .withArgs(ContractType.BASIC_NFT, randomWallet.address);
    });
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
