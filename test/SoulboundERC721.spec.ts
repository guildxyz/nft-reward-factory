import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

// NFT CONFIG
const name = "SoulboundTestNFT";
const symbol = "SBT";

// CONTRACTS
let GuildRewardNFT: ContractFactory;
let factory: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;

describe("SoulboundERC721", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet] = await ethers.getSigners();
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFT = await ethers.getContractFactory("GuildRewardNFT");
    factory = await upgrades.deployProxy(
      GuildRewardNFT,
      ["SoulboundTestNFT", "SBT", "cid", wallet0.address, randomWallet.address],
      {
        kind: "uups"
      }
    );
    await factory.waitForDeployment();
  });

  it("should have initialized the state variables", async () => {
    expect(await factory.name()).to.eq(name);
    expect(await factory.symbol()).to.eq(symbol);
  });

  it("should be upgradeable", async () => {
    const upgraded = await upgrades.upgradeProxy(factory, GuildRewardNFT, {
      kind: "uups"
      // call: { fn: "reInitialize", args: [] }
    });

    expect(await upgraded.name()).to.eq(name);
    expect(await upgraded.symbol()).to.eq(symbol);
  });

  it("should revert when calling transfer/approval-related functions", async () => {
    await expect(factory.approve(wallet0.address, 0)).to.be.revertedWithCustomError(GuildRewardNFT, "Soulbound");
    await expect(factory.setApprovalForAll(wallet0.address, true)).to.be.revertedWithCustomError(
      GuildRewardNFT,
      "Soulbound"
    );
    await expect(factory.isApprovedForAll(wallet0.address, randomWallet.address)).to.be.revertedWithCustomError(
      GuildRewardNFT,
      "Soulbound"
    );
    await expect(factory.transferFrom(wallet0.address, randomWallet.address, 0)).to.be.revertedWithCustomError(
      GuildRewardNFT,
      "Soulbound"
    );
    await expect(
      factory["safeTransferFrom(address,address,uint256)"](wallet0.address, randomWallet.address, 0)
    ).to.be.revertedWithCustomError(GuildRewardNFT, "Soulbound");
    await expect(
      factory["safeTransferFrom(address,address,uint256,bytes)"](
        wallet0.address,
        randomWallet.address,
        0,
        ethers.ZeroHash
      )
    ).to.be.revertedWithCustomError(GuildRewardNFT, "Soulbound");
  });
});
