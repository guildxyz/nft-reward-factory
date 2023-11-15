// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/* solhint-disable max-line-length */

import { IERC5192 } from "../interfaces/IERC5192.sol";
import { ERC721Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import { IERC721Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import { ERC721EnumerableUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import { IERC721EnumerableUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";

/* solhint-enable max-line-length */

/// @title An enumerable soulbound ERC721.
/// @notice Allowance and transfer-related functions are disabled.
/// @dev Inheriting from upgradeable contracts here - even though we're using it in a non-upgradeable way,
/// we still want it to be initializable
contract SoulboundERC721 is ERC721Upgradeable, ERC721EnumerableUpgradeable, IERC5192 {
    /// @notice Error thrown when trying to query info about a token that's not (yet) minted.
    /// @param tokenId The queried id.
    error NonExistentToken(uint256 tokenId);

    /// @notice Error thrown when a function's execution is not possible, because this is a soulbound NFT.
    error Soulbound();

    // solhint-disable-next-line func-name-mixedcase
    function __SoulboundERC721_init(string memory name_, string memory symbol_) internal onlyInitializing {
        __ERC721_init(name_, symbol_);
        __ERC721Enumerable_init();
    }

    /// @inheritdoc ERC721EnumerableUpgradeable
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721EnumerableUpgradeable, ERC721Upgradeable) returns (bool) {
        return
            interfaceId == type(IERC5192).interfaceId ||
            interfaceId == type(IERC721EnumerableUpgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) revert NonExistentToken(tokenId);
        return true;
    }

    function approve(
        address /* to */,
        uint256 /* tokenId */
    ) public virtual override(IERC721Upgradeable, ERC721Upgradeable) {
        revert Soulbound();
    }

    function setApprovalForAll(
        address /* operator */,
        bool /* approved */
    ) public virtual override(IERC721Upgradeable, ERC721Upgradeable) {
        revert Soulbound();
    }

    function isApprovedForAll(
        address /* owner */,
        address /* operator */
    ) public view virtual override(IERC721Upgradeable, ERC721Upgradeable) returns (bool) {
        revert Soulbound();
    }

    function transferFrom(
        address /* from */,
        address /* to */,
        uint256 /* tokenId */
    ) public virtual override(IERC721Upgradeable, ERC721Upgradeable) {
        revert Soulbound();
    }

    function safeTransferFrom(
        address /* from */,
        address /* to */,
        uint256 /* tokenId */
    ) public virtual override(IERC721Upgradeable, ERC721Upgradeable) {
        revert Soulbound();
    }

    function safeTransferFrom(
        address /* from */,
        address /* to */,
        uint256 /* tokenId */,
        bytes memory /* data */
    ) public virtual override(IERC721Upgradeable, ERC721Upgradeable) {
        revert Soulbound();
    }

    /// @dev Still used for minting/burning.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721EnumerableUpgradeable, ERC721Upgradeable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
}
