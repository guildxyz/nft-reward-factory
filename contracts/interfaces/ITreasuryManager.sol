// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A contract that manages fee-related functionality.
interface ITreasuryManager {
    /// @notice Sets the minting fee.
    /// @dev Callable only by the owner.
    /// @param newFee The new fee in base units.
    function setFee(uint256 newFee) external;

    /// @notice Sets the address that receives the fees.
    /// @dev Callable only by the owner.
    /// @param newTreasury The new address of the treasury.
    function setTreasury(address payable newTreasury) external;

    /// @notice The base minting fee of a token.
    /// @return fee The amount of the fee in base units.
    function fee() external view returns (uint256 fee);

    /// @notice Sets the fee override for a specific token.
    /// @dev Callable only by the owner.
    /// @param tokenAddress The address of the token.
    /// @param newFee The new fee amount in base units.
    function setFeeOverride(address tokenAddress, uint256 newFee) external;

    /// @notice The minting fee of a token for a specific caller.
    /// @param tokenAddress The address of the token.
    /// @return tokenFee The fee for the token in base units.
    function getFeeWithOverrides(address tokenAddress) external view returns (uint256 tokenFee);

    /// @notice Gets both the fee and the treasury address for optimization purposes.
    /// @dev Gets the fee for the caller - might only make sense to call it from a contract.
    /// @return tokenFee The fee for the token in base units.
    /// @return treasuryAddress The address of the treasury.
    function getFeeData() external view returns (uint256 tokenFee, address payable treasuryAddress);

    /// @notice Returns the address that receives the fees.
    function treasury() external view returns (address payable);

    /// @notice Event emitted when a token's fee is changed.
    /// @param newFee The new amount of fee in base units.
    event FeeChanged(uint256 newFee);

    /// @notice Event emitted when a fee override is set.
    /// @param tokenAddress The address of the token.
    /// @param newFee The new fee amount in base units.
    event FeeOverrideChanged(address tokenAddress, uint256 newFee);

    /// @notice Event emitted when the treasury address is changed.
    /// @param newTreasury The new address of the treasury.
    event TreasuryChanged(address newTreasury);
}
