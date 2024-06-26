// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IGuildRewardNFTFactory } from "./IGuildRewardNFTFactory.sol";
import { IMaxSupply } from "./IMaxSupply.sol";

/// @title An NFT distributed as a reward for Guild.xyz users.
interface IConfigurableGuildRewardNFT is IMaxSupply {
    /// @notice The address of the proxy to be used when interacting with the factory.
    /// @dev Used to access the factory's address when interacting through minimal proxies.
    /// @return factoryAddress The address of the factory.
    function factoryProxy() external view returns (address factoryAddress);

    /// @notice The maximum amount of tokens a Guild user can claim from the token.
    /// @dev Doesn't matter if they are claimed in the same transaction or separately.
    /// @return mintableAmountPerUser The amount of tokens. Unlimited if zero.
    function mintableAmountPerUser() external view returns (uint256 mintableAmountPerUser);

    /// @notice The time interval while a signature is valid.
    /// @return validity The time interval in seconds.
    // solhint-disable func-name-mixedcase
    function SIGNATURE_VALIDITY() external pure returns (uint256 validity);

    /// @notice Returns the number of tokens the user claimed.
    /// @dev Analogous to balanceOf(address), but works with Guild user ids.
    /// @param userId The id of the user on Guild.
    /// @return amount The number of tokens the userId has claimed.
    function balanceOf(uint256 userId) external view returns (uint256 amount);

    /// @notice Sets metadata and the associated addresses.
    /// @dev Initializer function callable only once.
    /// @param nftConfig See struct ConfigurableNFTConfig in IGuildRewardNFTFactory.
    /// @param factoryProxyAddress The address of the factory.
    function initialize(
        IGuildRewardNFTFactory.ConfigurableNFTConfig memory nftConfig,
        address factoryProxyAddress
    ) external;

    // Disable solhint for the next functions because this seems to be the only way the docgen plugin works correctly.
    // solhint-disable max-line-length

    /// @notice Claims tokens to the given address.
    /// @param amount The amount of tokens to mint. Should be less or equal to mintableAmountPerUser.
    /// @param receiver The address that receives the token.
    /// @param userId The id of the user on Guild.
    /// @param signedAt The timestamp marking the time when the data were signed.
    /// @param signature The following signed by validSigner: amount, signedAt, receiver, userId, chainId, the contract's address.
    function claim(
        uint256 amount,
        address receiver,
        uint256 userId,
        uint256 signedAt,
        bytes calldata signature
    ) external payable;

    /// @notice Burns tokens from the sender.
    /// @param tokenIds The tokenIds to burn. All of them should belong to userId.
    /// @param userId The id of the user on Guild.
    /// @param signedAt The timestamp marking the time when the data were signed.
    /// @param signature The following signed by validSigner: amount, signedAt, receiver, userId, chainId, the contract's address.
    function burn(uint256[] calldata tokenIds, uint256 userId, uint256 signedAt, bytes calldata signature) external;

    // solhint-enable max-line-length

    /// @notice Sets the locked (i.e. soulboundness) status of all of the tokens in this NFT.
    /// @dev Only callable by the owner.
    /// @param newLocked Whether the token should be soulbound or not.
    function setLocked(bool newLocked) external;

    /// @notice Sets the amount of tokens a user can mint from the token.
    /// @dev Only callable by the owner.
    /// @param newAmount The new amount a user can mint from the token. Unlimited if zero.
    function setMintableAmountPerUser(uint256 newAmount) external;

    /// @notice Updates the cid for tokenURI.
    /// @dev Only callable by the owner.
    /// @param newCid The new cid that points to the updated image.
    function updateTokenURI(string calldata newCid) external;

    /// @notice Event emitted whenever a claim succeeds.
    /// @param receiver The address that received the tokens.
    /// @param tokenId The id of the token.
    event Claimed(address indexed receiver, uint256 tokenId);

    /// @notice Event emitted whenever the cid is updated.
    event MetadataUpdate();

    /// @notice Event emitted when the mintableAmountPerUser is changed.
    /// @param newAmount The new amount a user can mint from the token.
    event MintableAmountPerUserChanged(uint256 newAmount);

    /// @notice Error thrown when the token is already claimed.
    error AlreadyClaimed();

    /// @notice Error thrown when the signature is already expired.
    error ExpiredSignature();

    /// @notice Error thrown when an incorrect amount of fee is attempted to be paid.
    /// @param paid The amount of funds received.
    /// @param requiredAmount The amount of fees required for claiming a single token.
    error IncorrectFee(uint256 paid, uint256 requiredAmount);

    /// @notice Error thrown when the sender is not permitted to do a specific action.
    error IncorrectSender();

    /// @notice Error thrown when the supplied signature is invalid.
    error IncorrectSignature();
}
