import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

// NFT CONFIG
const name = "SoulboundTestNFT";
const symbol = "SBT";

// CONTRACTS
let GuildRewardNFT: ContractFactory;
let nft: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;

describe("SoulboundERC721", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet] = await ethers.getSigners();
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFT = await ethers.getContractFactory("GuildRewardNFT");
    nft = (await GuildRewardNFT.deploy()) as Contract;
    await nft.waitForDeployment();
    await nft.initialize("SoulboundTestNFT", "SBT", "cid", wallet0.address, randomWallet.address);
  });

  it("should have initialized the state variables", async () => {
    expect(await nft.name()).to.eq(name);
    expect(await nft.symbol()).to.eq(symbol);
  });

  it("should revert when calling transfer/approval-related functions", async () => {
    await expect(nft.approve(wallet0.address, 0)).to.be.revertedWithCustomError(GuildRewardNFT, "Soulbound");
    await expect(nft.setApprovalForAll(wallet0.address, true)).to.be.revertedWithCustomError(
      GuildRewardNFT,
      "Soulbound"
    );
    await expect(nft.isApprovedForAll(wallet0.address, randomWallet.address)).to.be.revertedWithCustomError(
      GuildRewardNFT,
      "Soulbound"
    );
    await expect(nft.transferFrom(wallet0.address, randomWallet.address, 0)).to.be.revertedWithCustomError(
      GuildRewardNFT,
      "Soulbound"
    );
    await expect(
      nft["safeTransferFrom(address,address,uint256)"](wallet0.address, randomWallet.address, 0)
    ).to.be.revertedWithCustomError(GuildRewardNFT, "Soulbound");
    await expect(
      nft["safeTransferFrom(address,address,uint256,bytes)"](wallet0.address, randomWallet.address, 0, ethers.ZeroHash)
    ).to.be.revertedWithCustomError(GuildRewardNFT, "Soulbound");
  });
});
