// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title An NFT distributed as a reward for Guild.xyz users.
interface IGuildRewardNFT {
    /// @notice Returns true if the address has already claimed their token.
    /// @param account The user's address.
    /// @return claimed Whether the address has claimed their token.
    function hasClaimed(address account) external view returns (bool claimed);

    /// @return signer The address that signs the metadata.
    function validSigner() external view returns (address signer);

    /// @notice Claims tokens to the given address.
    /// @dev The contract needs to be approved if ERC20 tokens are used.
    /// @param payToken The address of the token that's used for paying the minting fees. 0 for ether.
    /// @param receiver The address that receives the token.
    /// @param signature The following signed by validSigner: receiver, chainId, the contract's address.
    function claim(address payToken, address receiver, bytes calldata signature) external payable;

    /// @notice Burns a token from the sender.
    /// @param tokenId The id of the token to burn.
    function burn(uint256 tokenId) external;

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

    /// @notice Event emitted when the validSigner is changed.
    /// @param newValidSigner The new address of validSigner.
    event ValidSignerChanged(address newValidSigner);

    /// @notice Error thrown when the token is already claimed.
    error AlreadyClaimed();

    /// @notice Error thrown when an incorrect amount of fee is attempted to be paid.
    /// @param paid The amount of funds received.
    /// @param requiredAmount The amount of fees required for minting.
    error IncorrectFee(uint256 paid, uint256 requiredAmount);

    /// @notice Error thrown when such a token is attempted to be used for paying that has no fee set.
    /// @dev The owner should set a fee for the token to solve this issue.
    /// @param token The address of the token that cannot be used.
    error IncorrectPayToken(address token);

    /// @notice Error thrown when the sender is not permitted to do a specific action.
    error IncorrectSender();

    /// @notice Error thrown when the supplied signature is invalid.
    error IncorrectSignature();

    /// @notice Error thrown when trying to query info about a token that's not (yet) minted.
    /// @param tokenId The queried id.
    error NonExistentToken(uint256 tokenId);
}
