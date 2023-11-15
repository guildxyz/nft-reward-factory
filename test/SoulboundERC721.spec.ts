import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

// NFT CONFIG
const name = "SoulboundTestNFT";
const symbol = "SBT";

// CONTRACTS
let BasicGuildRewardNFT: ContractFactory;
let nft: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;

describe("SoulboundERC721", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet] = await ethers.getSigners();
  });

  beforeEach("deploy contract", async () => {
    BasicGuildRewardNFT = await ethers.getContractFactory("BasicGuildRewardNFT");
    nft = (await BasicGuildRewardNFT.deploy()) as Contract;
    await nft.waitForDeployment();
    await nft.initialize("SoulboundTestNFT", "SBT", "cid", wallet0.address, wallet0.address, 0, randomWallet.address);
  });

  it("should have initialized the state variables", async () => {
    expect(await nft.name()).to.eq(name);
    expect(await nft.symbol()).to.eq(symbol);
  });

  it("should revert when calling transfer/approval-related functions", async () => {
    await expect(nft.approve(wallet0.address, 0)).to.be.revertedWithCustomError(BasicGuildRewardNFT, "Soulbound");
    await expect(nft.setApprovalForAll(wallet0.address, true)).to.be.revertedWithCustomError(
      BasicGuildRewardNFT,
      "Soulbound"
    );
    await expect(nft.isApprovedForAll(wallet0.address, randomWallet.address)).to.be.revertedWithCustomError(
      BasicGuildRewardNFT,
      "Soulbound"
    );
    await expect(nft.transferFrom(wallet0.address, randomWallet.address, 0)).to.be.revertedWithCustomError(
      BasicGuildRewardNFT,
      "Soulbound"
    );
    await expect(
      nft["safeTransferFrom(address,address,uint256)"](wallet0.address, randomWallet.address, 0)
    ).to.be.revertedWithCustomError(BasicGuildRewardNFT, "Soulbound");
    await expect(
      nft["safeTransferFrom(address,address,uint256,bytes)"](wallet0.address, randomWallet.address, 0, ethers.ZeroHash)
    ).to.be.revertedWithCustomError(BasicGuildRewardNFT, "Soulbound");
  });

  it("should have a locked function that throws for not minted tokens", async () => {
    const tokenId = 1;
    await expect(nft.locked(tokenId))
      .to.be.revertedWithCustomError(BasicGuildRewardNFT, "NonExistentToken")
      .withArgs(tokenId);
  });
});
