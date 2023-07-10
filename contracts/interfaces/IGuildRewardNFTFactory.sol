// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A simple factory deploying minimal proxy contracts for GuildRewardNFT.
interface IGuildRewardNFTFactory {
    /// @notice Sets metadata and the associated addresses.
    /// @dev Initializer function callable only once.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param cid The cid used to construct the tokenURI for the token to be minted.
    function initialize(string memory name, string memory symbol, string calldata cid) external;

    /// @notice Deploys a minimal proxy for the NFT.
    /// @param urlName The url name of the guild the NFT is deployed in.
    /// @param name The name of the NFT to be created.
    /// @param symbol The symbol of the NFT to be created.
    /// @param cid The cid used to construct the tokenURI of the NFT to be created.
    function clone(string calldata urlName, string calldata name, string calldata symbol, string calldata cid) external;

    /// @notice Returns the reward NFT address for a guild.
    /// @param urlName The url name of the guild the NFT is deployed in.
    /// @return token The address of the token.
    function deployedTokenContracts(string calldata urlName) external view returns (address token);

    /// @notice Event emitted when a new NFT is deployed.
    /// @param urlName The url name of the guild the NFT is deployed in.
    /// @param tokenAddress The address of the token.
    event RewardNFTDeployed(string urlName, address tokenAddress);
}
