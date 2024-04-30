// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMaxSupply {
    /// @notice The maximum number of tokens that can ever be minted.
    /// @return count The number of tokens.
    function maxSupply() external view returns (uint256 count);

    /// @notice Sets the maximum number of tokens that can ever be minted.
    /// @dev Only callable by the owner.
    /// @param newMaxSupply The number of tokens.
    function setMaxSupply(uint256 newMaxSupply) external;

    /// @notice Event emitted when the maxSupply is changed.
    /// @param newMaxSupply The number of tokens.
    event MaxSupplyChanged(uint256 newMaxSupply);

    /// @notice Error thrown when the maximum supply attempted to be set is zero.
    error MaxSupplyZero();

    /// @notice Error thrown when the tokenId is higher than the maximum supply.
    /// @param maxSupply The maximum supply of the token.
    error MaxSupplyReached(uint256 maxSupply);
}
