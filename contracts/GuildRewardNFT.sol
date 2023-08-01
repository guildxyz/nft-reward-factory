//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { IGuildRewardNFT } from "./interfaces/IGuildRewardNFT.sol";
import { IGuildRewardNFTFactory } from "./interfaces/IGuildRewardNFTFactory.sol";
import { ITreasuryManager } from "./interfaces/ITreasuryManager.sol";
import { LibTransfer } from "./lib/LibTransfer.sol";
import { SoulboundERC721 } from "./token/SoulboundERC721.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title An NFT distributed as a reward for Guild.xyz users.
contract GuildRewardNFT is IGuildRewardNFT, Initializable, OwnableUpgradeable, SoulboundERC721 {
    using ECDSA for bytes32;
    using LibTransfer for address;
    using LibTransfer for address payable;

    address public factoryProxy;

    /// @notice The cid for tokenURI.
    string internal cid;

    mapping(uint256 userId => uint256 claimed) internal claimedTokens;

    function initialize(
        string calldata name,
        string calldata symbol,
        string calldata _cid,
        address tokenOwner,
        address factoryProxyAddress
    ) public initializer {
        cid = _cid;
        factoryProxy = factoryProxyAddress;

        __SoulboundERC721_init(name, symbol);

        _transferOwnership(tokenOwner);
    }

    function claim(address payToken, address receiver, uint256 userId, bytes calldata signature) external payable {
        if (balanceOf(receiver) > 0 || claimedTokens[userId] > 0) revert AlreadyClaimed();
        if (!isValidSignature(receiver, userId, signature)) revert IncorrectSignature();

        uint256 tokenId = totalSupply();

        (uint256 fee, address payable treasury) = ITreasuryManager(factoryProxy).getFeeData(payToken);

        if (fee == 0) revert IncorrectPayToken(payToken);

        claimedTokens[userId]++;

        // Fee collection
        // When there is no msg.value, try transferring ERC20
        // When there is msg.value, ensure it's the correct amount
        if (msg.value == 0) treasury.sendTokenFrom(msg.sender, payToken, fee);
        else if (msg.value != fee) revert IncorrectFee(msg.value, fee);
        else treasury.sendEther(fee);

        _safeMint(receiver, tokenId);

        emit Claimed(receiver, tokenId);
    }

    function burn(uint256 tokenId, uint256 userId, bytes calldata signature) external {
        if (msg.sender != ownerOf(tokenId)) revert IncorrectSender();
        if (!isValidSignature(msg.sender, userId, signature)) revert IncorrectSignature();

        claimedTokens[userId]--;

        _burn(tokenId);
    }

    function updateTokenURI(string calldata newCid) external onlyOwner {
        cid = newCid;
        emit MetadataUpdate();
    }

    function hasClaimed(address account) external view returns (bool claimed) {
        return balanceOf(account) > 0;
    }

    function hasTheUserIdClaimed(uint256 userId) external view returns (bool claimed) {
        return claimedTokens[userId] > 0;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert NonExistentToken(tokenId);

        return string.concat("ipfs://", cid);
    }

    function validSigner() internal view returns (address signer) {
        return IGuildRewardNFTFactory(factoryProxy).validSigner();
    }

    /// @notice Checks the validity of the signature for the given params.
    function isValidSignature(address receiver, uint256 userId, bytes calldata signature) internal view returns (bool) {
        if (signature.length != 65) revert IncorrectSignature();
        bytes32 message = keccak256(abi.encode(receiver, userId, block.chainid, address(this)))
            .toEthSignedMessageHash();
        return message.recover(signature) == validSigner();
    }
}
