import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

// CONTRACTS
let mockERC20: Contract;
let GuildRewardNFTFactory: ContractFactory;
let nft: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;
let treasury: SignerWithAddress;
let signer: SignerWithAddress;

describe("TreasuryManager", () => {
  before("get accounts, setup variables, deploy ERC20", async () => {
    [wallet0, randomWallet, treasury, signer] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await ERC20.deploy("Mock Token", "MCK");
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
    nft = await upgrades.deployProxy(GuildRewardNFTFactory, [treasury.address, signer.address], {
      kind: "uups"
    });
    await nft.waitForDeployment();
  });

  it("should have initialized the state variables", async () => {
    expect(await nft.owner()).to.eq(wallet0.address);
    expect(await nft.treasury()).to.eq(treasury.address);
  });

  it("should be upgradeable", async () => {
    const upgraded = await upgrades.upgradeProxy(nft, GuildRewardNFTFactory, {
      kind: "uups"
      // call: { fn: "reInitialize", args: [] }
    });

    expect(await upgraded.owner()).to.eq(wallet0.address);
    expect(await upgraded.treasury()).to.eq(treasury.address);
  });

  context("#setFee", () => {
    it("should revert if a token's fee is attempted to be changed by anyone but the owner", async () => {
      await expect((nft.connect(randomWallet) as Contract).setFee(ethers.ZeroAddress, 12)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should change the tokens' fees", async () => {
      const mockFee0 = await nft.fee(mockERC20);
      await nft.setFee(mockERC20, 69);
      const mockFee1 = await nft.fee(mockERC20);
      expect(mockFee0).to.not.eq(mockFee1);
      expect(mockFee1).to.eq(69);
    });

    it("should emit FeeChanged event", async () => {
      const token = randomWallet.address;
      const newFee = 42;
      await expect(nft.setFee(token, newFee)).to.emit(nft, "FeeChanged").withArgs(token, newFee);
    });
  });

  context("#setTreasury", () => {
    it("should revert if the treasury is attempted to be changed by anyone but the owner", async () => {
      await expect((nft.connect(randomWallet) as Contract).setTreasury(randomWallet.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should change the treasury address", async () => {
      const treasury0 = await nft.treasury();
      await nft.setTreasury(randomWallet.address);
      const treasury1 = await nft.treasury();
      expect(treasury0).to.not.eq(treasury1);
      expect(treasury1).to.eq(randomWallet.address);
    });

    it("should emit TreasuryChanged event", async () => {
      await expect(nft.setTreasury(randomWallet.address))
        .to.emit(nft, "TreasuryChanged")
        .withArgs(randomWallet.address);
    });
  });
});
