// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A simple factory deploying minimal proxy contracts for GuildRewardNFT.
interface IGuildRewardNFTFactory {
    /// @notice The type of the contract.
    /// @dev Used as an identifier. Should be expanded in future updates.
    enum ContractType {
        BASIC_NFT
    }

    /// @notice Information about a specific deployment.
    /// @param contractAddress The address where the contract/clone is deployed.
    /// @param contractType The type of the contract.
    struct Deployment {
        address contractAddress;
        ContractType contractType;
    }

    /// @return signer The address that signs the metadata.
    function validSigner() external view returns (address signer);

    /// @notice Maps deployed implementation contract addresses to contract types.
    /// @param contractType The type of the contract.
    /// @return contractAddress The address of the deployed NFT contract.
    function nftImplementations(ContractType contractType) external view returns (address contractAddress);

    /// @notice Sets the associated addresses.
    /// @dev Initializer function callable only once.
    /// @param treasuryAddress The address that will receive the fees.
    /// @param validSignerAddress The address that will sign the metadata.
    function initialize(address payable treasuryAddress, address validSignerAddress) external;

    /// @notice Deploys a minimal proxy for a basic NFT.
    /// @param guildId The id of the guild the NFT is deployed in.
    /// @param name The name of the NFT to be created.
    /// @param symbol The symbol of the NFT to be created.
    /// @param cid The cid used to construct the tokenURI of the NFT to be created.
    /// @param tokenOwner The address that will be the owner of the deployed token.
    function deployBasicNFT(
        uint256 guildId,
        string calldata name,
        string calldata symbol,
        string calldata cid,
        address tokenOwner
    ) external;

    /// @notice Returns the reward NFT addresses for a guild.
    /// @param guildId The id of the guild the NFTs are deployed in.
    /// @return tokens The addresses of the tokens deployed for guildId.
    function getDeployedTokenContracts(uint256 guildId) external view returns (Deployment[] memory tokens);

    /// @notice Sets the address that signs the metadata.
    /// @dev Callable only by the owner.
    /// @param newValidSigner The new address of validSigner.
    function setValidSigner(address newValidSigner) external;

    /// @notice Sets the address of the contract where a specific NFT is implemented.
    /// @dev Callable only by the owner.
    /// @param contractType The type of the contract.
    /// @param newNFT The address of the deployed NFT contract.
    function setNFTImplementation(ContractType contractType, address newNFT) external;

    /// @notice Event emitted when an NFT implementation is changed.
    /// @param contractType The type of the contract.
    /// @param newNFT The new address of the NFT implementation.
    event ImplementationChanged(ContractType contractType, address newNFT);

    /// @notice Event emitted when a new NFT is deployed.
    /// @param guildId The id of the guild the NFT is deployed in.
    /// @param tokenAddress The address of the token.
    event RewardNFTDeployed(uint256 guildId, address tokenAddress);

    /// @notice Event emitted when the validSigner is changed.
    /// @param newValidSigner The new address of validSigner.
    event ValidSignerChanged(address newValidSigner);
}
