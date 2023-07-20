//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { IGuildRewardNFT } from "./interfaces/IGuildRewardNFT.sol";
import { IGuildRewardNFTFactory } from "./interfaces/IGuildRewardNFTFactory.sol";
import { TreasuryManager } from "./utils/TreasuryManager.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ClonesUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title A simple factory deploying minimal proxy contracts for GuildRewardNFT.
contract GuildRewardNFTFactory is
    IGuildRewardNFTFactory,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    TreasuryManager
{
    address public nftImplementation;
    address public validSigner;

    mapping(uint256 guildId => address[] tokens) internal deployedTokenContracts;

    /// @notice Empty space reserved for future updates.
    uint256[47] private __gap;

    function initialize(address payable treasuryAddress, address validSignerAddress) public initializer {
        validSigner = validSignerAddress;
        __Ownable_init();
        __TreasuryManager_init(treasuryAddress);
    }

    function clone(
        uint256 guildId,
        string calldata name,
        string calldata symbol,
        string calldata cid,
        address tokenOwner
    ) external {
        address deployedCloneAddress = ClonesUpgradeable.clone(nftImplementation);
        IGuildRewardNFT deployedClone = IGuildRewardNFT(deployedCloneAddress);

        deployedClone.initialize(name, symbol, cid, tokenOwner, address(this));

        deployedTokenContracts[guildId].push(deployedCloneAddress);

        emit RewardNFTDeployed(guildId, deployedCloneAddress);
    }

    function setNFTImplementation(address newNFT) external onlyOwner {
        nftImplementation = newNFT;
        emit ImplementationChanged(newNFT);
    }

    function setValidSigner(address newValidSigner) external onlyOwner {
        validSigner = newValidSigner;
        emit ValidSignerChanged(newValidSigner);
    }

    function getDeployedTokenContracts(uint256 guildId) external view returns (address[] memory tokens) {
        return deployedTokenContracts[guildId];
    }

    // solhint-disable-next-line no-empty-blocks
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
