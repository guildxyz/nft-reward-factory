import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, Contract, ContractFactory } from "ethers";
import { ethers, upgrades } from "hardhat";

// NFT CONFIG (without owner & treasury)
const sampleCids = ["QmPaZD7i8TpLEeGjHtGoXe4mPKbRNNt8YTHH5nrKoqz9wJ", "QmcaGypWsmzaSQQGuExUjtyTRvZ2FF525Ww6PBNWWgkkLj"];
const baseNFTConfig = {
  name: "Guild NFT",
  symbol: "GUILDNFT",
  cid: sampleCids[0],
  tokenFee: ethers.parseEther("0.1"),
  soulbound: true,
  maxSupply: 10n,
  mintableAmountPerUser: 1n
};
let nftConfig: typeof baseNFTConfig & { tokenOwner: string; treasury: string };
const fee = ethers.parseEther("0.15");
const sampleAmount = 1n;

// CONTRACTS
let ConfigurableGuildRewardNFT: ContractFactory;
let nft: Contract;
let nftMultipleMints: Contract;
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
const sampleSignedAt = Math.floor(Date.now() / 1000);

enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}

const createSignature = async (
  wallet: SignerWithAddress,
  amount: BigNumberish,
  receiver: string,
  userId: number,
  signedAt: number,
  chainid: BigNumberish,
  nftAddress: string
) => {
  const payload = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "uint256", "address", "uint256", "uint256", "address"],
    [amount, signedAt, receiver, userId, chainid, nftAddress]
  );
  const payloadHash = ethers.keccak256(payload);
  return wallet.signMessage(ethers.getBytes(payloadHash));
};

describe("ConfigurableGuildRewardNFT", () => {
  before("get accounts, setup variables", async () => {
    [wallet0, randomWallet, treasury, adminTreasury, signer] = await ethers.getSigners();

    nftConfig = {
      ...baseNFTConfig,
      tokenOwner: wallet0.address,
      treasury: adminTreasury.address
    };

    chainId = (await ethers.provider.getNetwork()).chainId;
  });

  beforeEach("deploy contract", async () => {
    GuildRewardNFTFactory = await ethers.getContractFactory("GuildRewardNFTFactory");
    factory = await upgrades.deployProxy(GuildRewardNFTFactory, [treasury.address, fee, signer.address], {
      kind: "uups"
    });
    await factory.waitForDeployment();

    ConfigurableGuildRewardNFT = await ethers.getContractFactory("ConfigurableGuildRewardNFT");
    nft = (await ConfigurableGuildRewardNFT.deploy()) as Contract;
    await nft.waitForDeployment();
    await nft.initialize(nftConfig, await factory.getAddress());

    nftMultipleMints = (await ConfigurableGuildRewardNFT.deploy()) as Contract;
    await nftMultipleMints.waitForDeployment();
    await nftMultipleMints.initialize({ ...nftConfig, mintableAmountPerUser: 5 }, await factory.getAddress());

    await factory.setNFTImplementation(ContractType.CONFIGURABLE_NFT, nft);
    await factory.setFee(fee);
  });

  it("should have initialized the state variables", async () => {
    expect(await nft.name()).to.eq(nftConfig.name);
    expect(await nft.symbol()).to.eq(nftConfig.symbol);
    expect(await nft.owner()).to.eq(wallet0.address);
    expect(await nft.maxSupply()).to.eq(nftConfig.maxSupply);
    expect(await nft.mintableAmountPerUser()).to.eq(nftConfig.mintableAmountPerUser);
    expect(await nft.factoryProxy()).to.eq(await factory.getAddress());
  });

  context("Claiming and burning", () => {
    let sampleSignature: string;

    beforeEach("create signature", async () => {
      sampleSignature = await createSignature(
        signer,
        sampleAmount,
        wallet0.address,
        sampleUserId,
        sampleSignedAt,
        chainId,
        await nft.getAddress()
      );
    });

    context("#claim", () => {
      it("should revert if the signature is expired", async () => {
        const validity = await nft.SIGNATURE_VALIDITY();
        const oldTimestamp = Math.floor(Date.now() / 1000) - Number(validity) - 10;
        await expect(
          nft.claim(
            sampleAmount,
            wallet0.address,
            sampleUserId,
            oldTimestamp,
            await createSignature(
              signer,
              sampleAmount,
              wallet0.address,
              sampleUserId,
              oldTimestamp,
              chainId,
              await nft.getAddress()
            ),
            {
              value: fee + nftConfig.tokenFee
            }
          )
        ).to.be.revertedWithCustomError(nft, "ExpiredSignature");
      });

      it("should revert if the address has already claimed all of their tokens", async () => {
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });
        await expect(
          nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
            value: fee + nftConfig.tokenFee
          })
        ).to.be.revertedWithCustomError(nft, "AlreadyClaimed");
      });

      it("should revert if the userId has already claimed all of their tokens", async () => {
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });
        await expect(
          nft.claim(sampleAmount, randomWallet.address, sampleUserId, sampleSignedAt, sampleSignature, {
            value: fee + nftConfig.tokenFee
          })
        ).to.be.revertedWithCustomError(nft, "AlreadyClaimed");
      });

      it("should revert if the signature is incorrect", async () => {
        await expect(
          nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, ethers.ZeroHash, {
            value: fee + nftConfig.tokenFee
          })
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");

        await expect(
          nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature.slice(0, -2), {
            value: fee + nftConfig.tokenFee
          })
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");

        await expect(
          nft.claim(
            sampleAmount,
            wallet0.address,
            sampleUserId,
            sampleSignedAt,
            await createSignature(
              signer,
              sampleAmount,
              randomWallet.address,
              sampleUserId,
              sampleSignedAt,
              chainId,
              await nft.getAddress()
            ),
            {
              value: fee + nftConfig.tokenFee
            }
          )
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");
      });

      it("should increment the total supply", async () => {
        const totalSupply0 = await nft.totalSupply();
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });
        const totalSupply1 = await nft.totalSupply();
        expect(totalSupply1).to.eq(totalSupply0 + 1n);
      });

      it("should increment the address' claimed tokens", async () => {
        const userBalance0 = await nft["balanceOf(address)"](wallet0.address);
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });
        const userBalance1 = await nft["balanceOf(address)"](wallet0.address);
        expect(userBalance1).to.eq(userBalance0 + sampleAmount);
      });

      it("should increment the userId's claimed tokens", async () => {
        const userBalance0 = await nft["balanceOf(uint256)"](sampleUserId);
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });
        const userBalance1 = await nft["balanceOf(uint256)"](sampleUserId);
        expect(userBalance1).to.eq(userBalance0 + sampleAmount);
      });

      it("should revert if the max supply is reached", async () => {
        const newMaxSupply = sampleAmount;
        await nft.setMaxSupply(newMaxSupply);
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });

        const signature = await createSignature(
          signer,
          sampleAmount,
          randomWallet.address,
          sampleUserId + 1,
          sampleSignedAt,
          chainId,
          await nft.getAddress()
        );
        await expect(
          nft.claim(sampleAmount, randomWallet.address, sampleUserId + 1, sampleSignedAt, signature, {
            value: fee + nftConfig.tokenFee
          })
        )
          .to.be.revertedWithCustomError(nft, "MaxSupplyReached")
          .withArgs(newMaxSupply);
      });

      it("should mint the token", async () => {
        const totalSupply = await nft.totalSupply();
        const tokenId = totalSupply;
        expect(await nft["balanceOf(address)"](wallet0.address)).to.eq(0);
        await expect(nft.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID");
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });
        expect(await nft["balanceOf(address)"](wallet0.address)).to.eq(1);
        expect(await nft.ownerOf(tokenId)).to.eq(wallet0.address);
      });

      it("should mint multiple tokens", async () => {
        const amount = 3n;
        const signature = createSignature(
          signer,
          amount,
          wallet0.address,
          sampleUserId,
          sampleSignedAt,
          chainId,
          await nftMultipleMints.getAddress()
        );

        await factory.setNFTImplementation(ContractType.CONFIGURABLE_NFT, nftMultipleMints);

        const totalSupply = await nftMultipleMints.totalSupply();
        const tokenId = totalSupply;
        expect(await nftMultipleMints["balanceOf(address)"](wallet0.address)).to.eq(0);
        await expect(nftMultipleMints.ownerOf(tokenId)).to.be.revertedWith("ERC721: invalid token ID");
        await nftMultipleMints.claim(amount, wallet0.address, sampleUserId, sampleSignedAt, signature, {
          value: (fee + nftConfig.tokenFee) * amount
        });
        expect(await nftMultipleMints["balanceOf(address)"](wallet0.address)).to.eq(3);
        expect(await nftMultipleMints.ownerOf(tokenId)).to.eq(wallet0.address);
      });

      it("should emit Locked event when minting soulbound tokens", async () => {
        const tokenId = await nft.totalSupply();
        await expect(
          nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
            value: fee + nftConfig.tokenFee
          })
        )
          .to.emit(nft, "Locked")
          .withArgs(tokenId);
      });

      it("should emit Claimed event", async () => {
        await expect(
          nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
            value: fee + nftConfig.tokenFee
          })
        )
          .to.emit(nft, "Claimed")
          .withArgs(wallet0.address, 0);
      });

      it("should transfer ether to both treasuries", async () => {
        await expect(
          nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
            value: fee + nftConfig.tokenFee
          })
        ).to.changeEtherBalances(
          [wallet0, treasury, adminTreasury],
          [-(fee + nftConfig.tokenFee), fee, nftConfig.tokenFee]
        );
      });

      it("should revert if an incorrect msg.value is received", async () => {
        await expect(
          nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
            value: fee * 2n
          })
        )
          .to.be.revertedWithCustomError(nft, "IncorrectFee")
          .withArgs(fee * 2n, fee + nftConfig.tokenFee);

        await expect(nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature))
          .to.be.revertedWithCustomError(nft, "IncorrectFee")
          .withArgs(0, fee + nftConfig.tokenFee);
      });
    });

    context("#burn", () => {
      beforeEach("claim a token", async () => {
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, sampleSignature, {
          value: fee + nftConfig.tokenFee
        });
      });

      it("should revert if the signature is expired", async () => {
        const validity = await nft.SIGNATURE_VALIDITY();
        const oldTimestamp = Math.floor(Date.now() / 1000) - Number(validity) - 10;
        await expect(
          nft.burn(
            [0],
            sampleUserId,
            oldTimestamp,
            await createSignature(
              signer,
              sampleAmount,
              wallet0.address,
              sampleUserId,
              oldTimestamp,
              chainId,
              await nft.getAddress()
            )
          )
        ).to.be.revertedWithCustomError(nft, "ExpiredSignature");
      });

      it("should revert if a token is attempted to be burned by anyone but it's owner", async () => {
        await expect(
          (nft.connect(randomWallet) as Contract).burn(
            [0],
            sampleUserId,
            sampleSignedAt,
            createSignature(
              signer,
              1,
              randomWallet.address,
              sampleUserId,
              sampleSignedAt,
              chainId,
              await nft.getAddress()
            )
          )
        ).to.be.revertedWithCustomError(nft, "IncorrectSender");
      });

      it("should revert if the signature is incorrect", async () => {
        await expect(nft.burn([0], sampleUserId, sampleSignedAt, ethers.ZeroHash)).to.be.revertedWithCustomError(
          nft,
          "IncorrectSignature"
        );

        await expect(
          nft.burn([0], sampleUserId, sampleSignedAt, sampleSignature.slice(0, -2))
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");

        await expect(
          nft.burn(
            [0],
            sampleUserId,
            sampleSignedAt,
            await createSignature(
              signer,
              sampleAmount,
              randomWallet.address,
              sampleUserId,
              sampleSignedAt,
              chainId,
              await nft.getAddress()
            )
          )
        ).to.be.revertedWithCustomError(nft, "IncorrectSignature");
      });

      it("should decrement the address' claimed tokens", async () => {
        const userBalance0 = await nft["balanceOf(address)"](wallet0.address);
        await nft.burn([0], sampleUserId, sampleSignedAt, sampleSignature);
        const userBalance1 = await nft["balanceOf(address)"](wallet0.address);
        expect(userBalance1).to.eq(userBalance0 - 1n);
      });

      it("should decrement the userId's claimed tokens", async () => {
        const userBalance0 = await nft["balanceOf(uint256)"](sampleUserId);
        await nft.burn([0], sampleUserId, sampleSignedAt, sampleSignature);
        const userBalance1 = await nft["balanceOf(uint256)"](sampleUserId);
        expect(userBalance1).to.eq(userBalance0 - 1n);
      });

      it("should decrement the total supply", async () => {
        const totalSupply0 = await nft.totalSupply();
        await nft.burn([0], sampleUserId, sampleSignedAt, sampleSignature);
        const totalSupply1 = await nft.totalSupply();
        expect(totalSupply1).to.eq(totalSupply0 - 1n);
      });

      it("should burn the token", async () => {
        const tokenId = 0;
        const tokenOfOwnerByIndex = await nft.tokenOfOwnerByIndex(wallet0.address, 0);
        expect(tokenOfOwnerByIndex).to.eq(tokenId);

        await nft.burn([tokenId], sampleUserId, sampleSignedAt, sampleSignature);

        await expect(nft.tokenOfOwnerByIndex(wallet0.address, 0)).to.be.revertedWith(
          "ERC721Enumerable: owner index out of bounds"
        );
      });

      it("should burn multiple tokens", async () => {
        const signature = createSignature(
          signer,
          2n,
          wallet0.address,
          sampleUserId,
          sampleSignedAt,
          chainId,
          await nftMultipleMints.getAddress()
        );

        await factory.setNFTImplementation(ContractType.CONFIGURABLE_NFT, nftMultipleMints);

        await nftMultipleMints.claim(2n, wallet0.address, sampleUserId, sampleSignedAt, signature, {
          value: (fee + nftConfig.tokenFee) * 2n
        });

        const tokenIds = [0, 1];
        const tokenOfOwnerByIndex0 = await nftMultipleMints.tokenOfOwnerByIndex(wallet0.address, 0);
        const tokenOfOwnerByIndex1 = await nftMultipleMints.tokenOfOwnerByIndex(wallet0.address, 1);
        expect(tokenOfOwnerByIndex0).to.eq(tokenIds[0]);
        expect(tokenOfOwnerByIndex1).to.eq(tokenIds[1]);

        await nftMultipleMints.burn(tokenIds, sampleUserId, sampleSignedAt, signature);

        await expect(nftMultipleMints.tokenOfOwnerByIndex(wallet0.address, 0)).to.be.revertedWith(
          "ERC721Enumerable: owner index out of bounds"
        );
        await expect(nftMultipleMints.tokenOfOwnerByIndex(wallet0.address, 1)).to.be.revertedWith(
          "ERC721Enumerable: owner index out of bounds"
        );
      });
    });
  });

  context("General config", () => {
    context("#setLocked", () => {
      beforeEach("claim a token", async () => {
        await nft.claim(
          sampleAmount,
          wallet0.address,
          sampleUserId,
          sampleSignedAt,
          await createSignature(
            signer,
            sampleAmount,
            wallet0.address,
            sampleUserId,
            sampleSignedAt,
            chainId,
            await nft.getAddress()
          ),
          {
            value: fee + nftConfig.tokenFee
          }
        );
      });

      it("should revert if the lock status is attempted to be changed by anyone but the owner", async () => {
        await expect((nft.connect(randomWallet) as Contract).setLocked(false)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should update locked status", async () => {
        const locked = false;
        await nft.setLocked(locked);
        const newLocked = await nft.locked(0);
        expect(newLocked).to.eq(locked);
      });

      it("should emit Locked/Unlocked event", async () => {
        await expect(nft.setLocked(false)).to.emit(nft, "Unlocked").withArgs(0);
        await expect(nft.setLocked(true)).to.emit(nft, "Locked").withArgs(0);
      });
    });

    context("#setMaxSupply", () => {
      it("should revert if maxSupply is attempted to be changed by anyone but the owner", async () => {
        await expect((nft.connect(randomWallet) as Contract).setMaxSupply(5)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should revert if maxSupply is attempted to be set to 0", async () => {
        await expect(nft.setMaxSupply(0)).to.be.revertedWithCustomError(nft, "MaxSupplyZero");
      });

      it("should update maxSupply", async () => {
        const maxSupply = 5;
        await nft.setMaxSupply(maxSupply);
        const newMaxSupply = await nft.maxSupply();
        expect(newMaxSupply).to.eq(maxSupply);
      });

      it("should emit MaxSupplyChanged event", async () => {
        const maxSupply = 5;
        await expect(nft.setMaxSupply(maxSupply)).to.emit(nft, "MaxSupplyChanged").withArgs(maxSupply);
      });
    });

    context("#setMintableAmountPerUser", () => {
      it("should revert if mintableAmountPerUser is attempted to be changed by anyone but the owner", async () => {
        await expect((nft.connect(randomWallet) as Contract).setMintableAmountPerUser(5)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should update mintableAmountPerUser", async () => {
        const mintableAmountPerUser = 5;
        await nft.setMintableAmountPerUser(mintableAmountPerUser);
        const newMintableAmountPerUser = await nft.mintableAmountPerUser();
        expect(newMintableAmountPerUser).to.eq(mintableAmountPerUser);
      });

      it("should emit MintableAmountPerUserChanged event", async () => {
        const mintableAmountPerUser = 5;
        await expect(nft.setMintableAmountPerUser(mintableAmountPerUser))
          .to.emit(nft, "MintableAmountPerUserChanged")
          .withArgs(mintableAmountPerUser);
      });
    });
  });

  context("TokenURI", () => {
    let signature: string;

    beforeEach("create signature, set strings", async () => {
      signature = await createSignature(
        signer,
        sampleAmount,
        wallet0.address,
        sampleUserId,
        sampleSignedAt,
        chainId,
        await nft.getAddress()
      );
    });

    context("#tokenURI", () => {
      it("should revert when trying to get the tokenURI for a non-existent token", async () => {
        await expect(nft.tokenURI(84)).to.revertedWithCustomError(nft, "NonExistentToken").withArgs(84);
      });

      it("should return the correct tokenURI", async () => {
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, signature, {
          value: fee + nftConfig.tokenFee
        });

        const tokenURI = await nft.tokenURI(0);
        const regex = new RegExp(`ipfs://${nftConfig.cid}`);
        expect(regex.test(tokenURI)).to.eq(true);
      });
    });

    context("#updateTokenURI", () => {
      beforeEach("claim a token", async () => {
        await nft.claim(sampleAmount, wallet0.address, sampleUserId, sampleSignedAt, signature, {
          value: fee + nftConfig.tokenFee
        });
      });

      it("should revert if the cid is attempted to be changed by anyone but the owner", async () => {
        await expect((nft.connect(randomWallet) as Contract).updateTokenURI(sampleCids[1])).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should update cid", async () => {
        const oldTokenURI = await nft.tokenURI(0);
        await nft.updateTokenURI(sampleCids[1]);
        const newTokenURI = await nft.tokenURI(0);
        expect(newTokenURI).to.not.eq(oldTokenURI);
        expect(newTokenURI).to.contain(sampleCids[1]);
      });

      it("should emit MetadataUpdate event", async () => {
        await expect(nft.updateTokenURI(sampleCids[1])).to.emit(nft, "MetadataUpdate").withArgs();
      });
    });
  });
});
