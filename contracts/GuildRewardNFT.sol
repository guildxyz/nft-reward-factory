//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { IGuildRewardNFT } from "./interfaces/IGuildRewardNFT.sol";
import { LibTransfer } from "./lib/LibTransfer.sol";
import { SoulboundERC721 } from "./token/SoulboundERC721.sol";
import { TreasuryManager } from "./utils/TreasuryManager.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { ECDSAUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

/// @title An NFT distributed as a reward for Guild.xyz users.
contract GuildRewardNFT is
    IGuildRewardNFT,
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    SoulboundERC721,
    TreasuryManager
{
    using ECDSAUpgradeable for bytes32;
    using LibTransfer for address;
    using LibTransfer for address payable;

    address public validSigner;

    /// @notice The cid for tokenURI.
    string internal cid;

    /// @notice The number of claimed tokens by userIds.
    mapping(uint256 userId => uint256 claimed) internal claimedTokens;

    /// @notice Empty space reserved for future updates.
    uint256[47] private __gap;

    /// @notice Sets metadata and the associated addresses.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param treasury The address where the collected fees will be sent.
    /// @param _validSigner The address that should sign the parameters for certain functions.
    /// @param _cid The cid used to construct the tokenURI for the token to be minted.
    function initialize(
        string memory name,
        string memory symbol,
        address payable treasury,
        address payable _validSigner,
        string calldata _cid
    ) public initializer {
        validSigner = _validSigner;
        cid = _cid;
        __Ownable_init();
        __UUPSUpgradeable_init();
        __SoulboundERC721_init(name, symbol);
        __TreasuryManager_init(treasury);
    }

    function claim(address payToken, address receiver, uint256 userId, bytes calldata signature) external payable {
        if (balanceOf(receiver) > 0 || claimedTokens[userId] > 0) revert AlreadyClaimed();
        if (!isValidSignature(receiver, userId, signature)) revert IncorrectSignature();

        uint256 tokenId = totalSupply();

        uint256 fee = fee[payToken];
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

    function setValidSigner(address newValidSigner) external onlyOwner {
        validSigner = newValidSigner;
        emit ValidSignerChanged(newValidSigner);
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

    // solhint-disable-next-line no-empty-blocks
    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @notice Checks the validity of the signature for the given params.
    function isValidSignature(address receiver, uint256 userId, bytes calldata signature) internal view returns (bool) {
        if (signature.length != 65) revert IncorrectSignature();
        bytes32 message = keccak256(abi.encode(receiver, userId, block.chainid, address(this)))
            .toEthSignedMessageHash();
        return message.recover(signature) == validSigner;
    }
}
