//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { IGuildRewardNFTFactory } from "./interfaces/IGuildRewardNFTFactory.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ClonesUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title A simple factory deploying minimal proxy contracts for GuildRewardNFT.
contract GuildRewardNFTFactory is IGuildRewardNFTFactory, Initializable, OwnableUpgradeable {
    mapping(string urlName => address token) public deployedTokenContracts;

    /// @notice Empty space reserved for future updates.
    uint256[49] private __gap;

    // TODO: set NFT name, symbol etc
    function clone(string calldata urlName) external {
        // TODO: make sure to only call this when directly calling the entry proxy
        address deployedClone = ClonesUpgradeable.clone(address(this));
        deployedTokenContracts[urlName] = deployedClone;
        emit RewardNFTDeployed(urlName, deployedClone);
    }
}
