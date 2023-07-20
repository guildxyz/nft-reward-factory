// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A simple factory deploying minimal proxy contracts for GuildRewardNFT.
interface IGuildRewardNFTFactory {
    /// @return nft The address of the deployed NFT contract.
    function nftImplementation() external view returns (address nft);

    /// @return signer The address that signs the metadata.
    function validSigner() external view returns (address signer);

    /// @notice Sets the associated addresses.
    /// @dev Initializer function callable only once.
    /// @param treasuryAddress The address that will receive the fees.
    /// @param validSignerAddress The address that will sign the metadata.
    function initialize(address payable treasuryAddress, address validSignerAddress) external;

    /// @notice Deploys a minimal proxy for the NFT.
    /// @param guildId The id of the guild the NFT is deployed in.
    /// @param name The name of the NFT to be created.
    /// @param symbol The symbol of the NFT to be created.
    /// @param cid The cid used to construct the tokenURI of the NFT to be created.
    /// @param tokenOwner The address that will be the owner of the deployed token.
    function clone(
        uint256 guildId,
        string calldata name,
        string calldata symbol,
        string calldata cid,
        address tokenOwner
    ) external;

    /// @notice Returns the reward NFT addresses for a guild.
    /// @param guildId The id of the guild the NFTs are deployed in.
    /// @return tokens The addresses of the tokens deployed for guildId.
    function getDeployedTokenContracts(uint256 guildId) external view returns (address[] memory tokens);

    /// @notice Sets the address that signs the metadata.
    /// @dev Callable only by the owner.
    /// @param newValidSigner The new address of validSigner.
    function setValidSigner(address newValidSigner) external;

    /// @notice Sets the address of the contract where the NFT is implemented.
    /// @dev Callable only by the owner.
    /// @param newNFT The address of the deployed NFT contract.
    function setNFTImplementation(address newNFT) external;

    /// @notice Event emitted when the NFT implementation is changed.
    /// @param newNFT The new address of the NFT implementation.
    event ImplementationChanged(address newNFT);

    /// @notice Event emitted when a new NFT is deployed.
    /// @param guildId The id of the guild the NFT is deployed in.
    /// @param tokenAddress The address of the token.
    event RewardNFTDeployed(uint256 guildId, address tokenAddress);

    /// @notice Event emitted when the validSigner is changed.
    /// @param newValidSigner The new address of validSigner.
    event ValidSignerChanged(address newValidSigner);
}
