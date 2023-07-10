//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { GuildRewardNFT } from "./GuildRewardNFT.sol";
import { IGuildRewardNFTFactory } from "./interfaces/IGuildRewardNFTFactory.sol";
import { ITreasuryManager } from "./interfaces/ITreasuryManager.sol";
import { ClonesUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title A simple factory deploying minimal proxy contracts for GuildRewardNFT.
contract GuildRewardNFTFactory is IGuildRewardNFTFactory, GuildRewardNFT {
    mapping(string urlName => address token) public deployedTokenContracts;

    /// @notice Empty space reserved for future updates.
    uint256[49] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    // solhint-disable-next-line no-empty-blocks
    constructor() GuildRewardNFT(address(this)) {}

    function initialize(string calldata name, string calldata symbol, string calldata cid) public initializer {
        __GuildRewardNFT_init(name, symbol, cid);
    }

    function clone(
        string calldata urlName,
        string calldata name,
        string calldata symbol,
        string calldata cid
    ) external {
        // TODO: make sure to only call this when directly calling the entry proxy
        address deployedCloneAddress = ClonesUpgradeable.clone(address(this));
        IGuildRewardNFTFactory deployedClone = IGuildRewardNFTFactory(deployedCloneAddress);

        deployedClone.initialize(name, symbol, cid);

        deployedTokenContracts[urlName] = deployedCloneAddress;

        emit RewardNFTDeployed(urlName, deployedCloneAddress);
    }
}
