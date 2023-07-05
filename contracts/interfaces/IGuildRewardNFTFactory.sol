// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A simple factory deploying minimal proxy contracts for GuildRewardNFT.
interface IGuildRewardNFTFactory {
    /// @notice Deploys a minimal proxy for the NFT.
    /// @param urlName The url name of the guild the NFT is deployed in.
    function clone(string calldata urlName) external;

    /// @notice Returns the reward NFT address for a guild.
    /// @param urlName The url name of the guild the NFT is deployed in.
    /// @return token The address of the token.
    function deployedTokenContracts(string calldata urlName) external view returns (address token);

    /// @notice Event emitted when a new NFT is deployed.
    /// @param urlName The url name of the guild the NFT is deployed in.
    /// @param tokenAddress The address of the token.
    event RewardNFTDeployed(string urlName, address tokenAddress);
}
