// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { ITreasuryManager } from "../interfaces/ITreasuryManager.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title A contract that manages fee-related functionality.
contract TreasuryManager is ITreasuryManager, Initializable, OwnableUpgradeable {
    address payable public treasury;

    uint256 public fee;

    /// @notice Fee overrides to be able to discount fees for specific guilds.
    mapping(address token => uint256 fee) internal _feeOverrides;

    /// @notice Empty space reserved for future updates.
    uint256[47] private __gap;

    /// @param treasury_ The address that will receive the fees.
    /// @param fee_ The fee amount in wei.
    // solhint-disable-next-line func-name-mixedcase
    function __TreasuryManager_init(address payable treasury_, uint256 fee_) internal onlyInitializing {
        treasury = treasury_;
        fee = fee_;
    }

    function setFee(uint256 newFee) external onlyOwner {
        fee = newFee;
        emit FeeChanged(newFee);
    }

    function setFeeOverride(address tokenAddress, uint256 newFee) external onlyOwner {
        _feeOverrides[tokenAddress] = newFee;
        emit FeeOverrideChanged(tokenAddress, newFee);
    }

    function setTreasury(address payable newTreasury) external onlyOwner {
        treasury = newTreasury;
        emit TreasuryChanged(newTreasury);
    }

    function getFeeWithOverrides(address tokenAddress) public view returns (uint256) {
        uint256 feeOverride = _feeOverrides[tokenAddress];
        return feeOverride != 0 ? feeOverride : fee;
    }

    function getFeeData() external view returns (uint256 tokenFee, address payable treasuryAddress) {
        uint256 correctFee = getFeeWithOverrides(msg.sender);
        return (correctFee, treasury);
    }
}
