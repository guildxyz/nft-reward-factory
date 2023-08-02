import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

// NFT CONFIG
const name = "Guild NFT";
const symbol = "GUILDNFT";
const fee = ethers.parseEther("0.1");
const price = ethers.parseEther("0.15");
const cids = ["QmPaZD7i8TpLEeGjHtGoXe4mPKbRNNt8YTHH5nrKoqz9wJ", "QmcaGypWsmzaSQQGuExUjtyTRvZ2FF525Ww6PBNWWgkkLj"];

// CONTRACTS
let BasicGuildRewardNFT: ContractFactory;
let nft: Contract;
let GuildRewardNFTFactory: ContractFactory;
let factory: Contract;

// Test accounts
let wallet0: SignerWithAddress;
let randomWallet: SignerWithAddress;
let treasury: SignerWithAddress;
let adminTreasury: SignerWithAddress;
let signer: SignerWithAddress;

let chainId: BigNumberish;
const sampleUserId = 42;

enum ContractType {
  BASIC_NFT
}

const createSignature = async (
  wallet: SignerWithAddress,
  receiver: string,
  userId: number,
  chainid: BigNumberish,
  nftAddress: string
) => {
  const payload = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256", "uint256", "address"],
    [receiver, userId, chainid, nftAddress]
  );
  const payloadHash = ethers.keccak256(payload);
  return wallet.signMessage(ethers.getBytes(payloadHash));
};

describe("BasicGuildRewardNFT", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet, treasury, adminTreasury, signer] = await ethers.getSigners();

    chainId = (await ethers.provider.getNetwork()).chainId;
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
    factory = await upgrades.deployProxy(GuildRewardNFTFactory, [treasury.address, fee, signer.address], {
      kind: "uups"
    });
    await factory.waitForDeployment();

    BasicGuildRewardNFT = await ethers.getContractFactory("BasicGuildRewardNFT");
    nft = (await BasicGuildRewardNFT.deploy()) as Contract;
    await nft.waitForDeployment();
    await nft.initialize(
      name,
      symbol,
      cids[0],
      wallet0.address,
      adminTreasury.address,
      price,
      await factory.getAddress()
    );

    await factory.setNFTImplementation(ContractType.BASIC_NFT, nft);
    await factory.setFee(fee);
  });

  it("should have initialized the state variables", async () => {
    expect(await nft.name()).to.eq(name);
    expect(await nft.symbol()).to.eq(symbol);
    expect(await nft.owner()).to.eq(wallet0.address);
    expect(await nft.factoryProxy()).to.eq(await factory.getAddress());
  });

  context("Claiming and burning", () => {
    let sampleSignature: string;

    beforeEach("create signature", async () => {
      sampleSignature = await createSignature(signer, wallet0.address, sampleUserId, chainId, await nft.getAddress());
    });

    context("#claim", () => {
      it("should revert if the address has already claimed", async () => {
        await nft.claim(wallet0.address, sampleUserId, sampleSignature, {
          value: fee + price
        });
        await expect(
          nft.claim(wallet0.address, sampleUserId, sampleSignature, {
            value: fee + price
          })
        ).to.be.revertedWithCustomError(nft, "AlreadyClaimed");
      });

      it("should revert if the userId has already claimed", async () => {
        await nft.claim(wallet0.address, sampleUserId, sampleSignature, {
          value: fee + price
        });
        await expect(
          nft.claim(randomWallet.address, sampleUserId, sampleSignature, {
            value: fee + price
          })
        ).to.be.revertedWithCustomError(nft, "AlreadyClaimed");
      });

      it("should revert if the signature is incorrect", async () => {
        await expect(
          nft.claim(wallet0.address, sampleUserId, ethers.ZeroHash, {
            value: fee + price
          })
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");

        await expect(
          nft.claim(wallet0.address, sampleUserId, sampleSignature.slice(0, -2), {
            value: fee + price
          })
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");

        await expect(
          nft.claim(
            wallet0.address,
            sampleUserId,
            await createSignature(signer, randomWallet.address, sampleUserId, chainId, await nft.getAddress()),
            {
              value: fee + price
            }
          )
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");
      });

      it("should increment the total supply", async () => {
        const totalSupply0 = await nft.totalSupply();
        await nft.claim(wallet0.address, sampleUserId, sampleSignature, {
          value: fee + price
        });
        const totalSupply1 = await nft.totalSupply();
        expect(totalSupply1).to.eq(totalSupply0 + 1n);
      });

      it("should set the address's claim status", async () => {
        const hasClaimed0 = await nft.hasClaimed(wallet0.address);
        await nft.claim(wallet0.address, sampleUserId, sampleSignature, {
          value: fee + price
        });
        const hasClaimed1 = await nft.hasClaimed(wallet0.address);
        expect(hasClaimed0).to.eq(false);
        expect(hasClaimed1).to.eq(true);
      });

      it("should set the userId's claim status", async () => {
        const hasTheUserIdClaimed0 = await nft.hasTheUserIdClaimed(sampleUserId);
        await nft.claim(wallet0.address, sampleUserId, sampleSignature, {
          value: fee + price
        });
        const hasTheUserIdClaimed1 = await nft.hasTheUserIdClaimed(sampleUserId);
        expect(hasTheUserIdClaimed0).to.eq(false);
        expect(hasTheUserIdClaimed1).to.eq(true);
      });

      it("should transfer ether to both treasuries", async () => {
        await expect(
          nft.claim(wallet0.address, sampleUserId, sampleSignature, {
            value: fee + price
          })
        ).to.changeEtherBalances([wallet0, treasury, adminTreasury], [-(fee + price), fee, price]);
      });

      it("should revert if an incorrect msg.value is received", async () => {
        await expect(
          nft.claim(wallet0.address, sampleUserId, sampleSignature, {
            value: fee * 2n
          })
        )
          .to.be.revertedWithCustomError(nft, "IncorrectFee")
          .withArgs(fee * 2n, fee + price);

        await expect(nft.claim(wallet0.address, sampleUserId, sampleSignature))
          .to.be.revertedWithCustomError(nft, "IncorrectFee")
          .withArgs(0, fee + price);
      });

      it("should mint the token", async () => {
        const totalSupply = await nft.totalSupply();
        const tokenId = totalSupply;
        expect(await nft.balanceOf(wallet0.address)).to.eq(0);
        await expect(nft.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID");
        await nft.claim(wallet0.address, sampleUserId, sampleSignature, {
          value: fee + price
        });
        expect(await nft.balanceOf(wallet0.address)).to.eq(1);
        expect(await nft.ownerOf(tokenId)).to.eq(wallet0.address);
      });

      it("should emit Claimed event", async () => {
        await expect(
          nft.claim(wallet0.address, sampleUserId, sampleSignature, {
            value: fee + price
          })
        )
          .to.emit(nft, "Claimed")
          .withArgs(wallet0.address, 0);
      });
    });

    context("#burn", () => {
      beforeEach("claim a token", async () => {
        await nft.claim(wallet0.address, sampleUserId, sampleSignature, {
          value: fee + price
        });
      });

      it("should revert if a token is attempted to be burned by anyone but it's owner", async () => {
        await expect(
          (nft.connect(randomWallet) as Contract).burn(0, sampleUserId, sampleSignature)
        ).to.be.revertedWithCustomError(nft, "IncorrectSender");
      });

      it("should revert if the signature is incorrect", async () => {
        await expect(nft.burn(0, sampleUserId, ethers.ZeroHash)).to.be.revertedWithCustomError(
          nft,
          "IncorrectSignature"
        );

        await expect(nft.burn(0, sampleUserId, sampleSignature.slice(0, -2))).to.be.revertedWithCustomError(
          nft,
          "IncorrectSignature"
        );

        await expect(
          nft.burn(
            0,
            sampleUserId,
            await createSignature(signer, randomWallet.address, sampleUserId, chainId, await nft.getAddress())
          )
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");
      });

      it("should reset hasClaimed to false", async () => {
        const hasClaimed0 = await nft.hasClaimed(wallet0.address);
        await nft.burn(0, sampleUserId, sampleSignature);
        const hasClaimed1 = await nft.hasClaimed(wallet0.address);
        expect(hasClaimed0).to.eq(true);
        expect(hasClaimed1).to.eq(false);
      });

      it("should reset hasTheUserIdClaimed to false", async () => {
        const hasTheUserIdClaimed0 = await nft.hasTheUserIdClaimed(sampleUserId);
        await nft.burn(0, sampleUserId, sampleSignature);
        const hasTheUserIdClaimed1 = await nft.hasTheUserIdClaimed(sampleUserId);
        expect(hasTheUserIdClaimed0).to.eq(true);
        expect(hasTheUserIdClaimed1).to.eq(false);
      });

      it("should decrement the total supply", async () => {
        const totalSupply0 = await nft.totalSupply();
        await nft.burn(0, sampleUserId, sampleSignature);
        const totalSupply1 = await nft.totalSupply();
        expect(totalSupply1).to.eq(totalSupply0 - 1n);
      });

      it("should burn the token", async () => {
        await expect(nft.burn(0, sampleUserId, sampleSignature)).to.changeTokenBalance(nft, wallet0, -1);
      });
    });
  });

  context("TokenURI", () => {
    let signature: string;

    beforeEach("create signature, set strings", async () => {
      signature = await createSignature(signer, wallet0.address, sampleUserId, chainId, await nft.getAddress());
    });

    context("#tokenURI", () => {
      it("should revert when trying to get the tokenURI for a non-existent token", async () => {
        await expect(nft.tokenURI(84)).to.revertedWithCustomError(nft, "NonExistentToken").withArgs(84);
      });

      it("should return the correct tokenURI", async () => {
        await nft.claim(wallet0.address, sampleUserId, signature, {
          value: fee + price
        });

        const tokenURI = await nft.tokenURI(0);
        const regex = new RegExp(`ipfs://${cids[0]}`);
        expect(regex.test(tokenURI)).to.eq(true);
      });
    });

    context("#updateTokenURI", () => {
      beforeEach("claim a token", async () => {
        await nft.claim(wallet0.address, sampleUserId, signature, {
          value: fee + price
        });
      });

      it("should revert if the cid is attempted to be changed by anyone but the owner", async () => {
        await expect((nft.connect(randomWallet) as Contract).updateTokenURI(cids[1])).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should update cid", async () => {
        const oldTokenURI = await nft.tokenURI(0);
        await nft.updateTokenURI(cids[1]);
        const newTokenURI = await nft.tokenURI(0);
        expect(newTokenURI).to.not.eq(oldTokenURI);
        expect(newTokenURI).to.contain(cids[1]);
      });

      it("should emit MetadataUpdate event", async () => {
        await expect(nft.updateTokenURI(cids[0])).to.emit(nft, "MetadataUpdate").withArgs();
      });
    });
  });
});
