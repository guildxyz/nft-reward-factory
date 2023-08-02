# TreasuryManager

A contract that manages fee-related functionality.

## Variables

### treasury

```solidity
address payable treasury
```

Returns the address that receives the fees.

### fee

```solidity
uint256 fee
```

The minting fee of a token.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

## Functions

### __TreasuryManager_init

```solidity
function __TreasuryManager_init(
    address payable treasury_,
    uint256 fee_
) internal
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `treasury_` | address payable | The address that will receive the fees. |
| `fee_` | uint256 | The fee amount in wei. |

### setFee

```solidity
function setFee(
    uint256 newFee
) external
```

Sets the minting fee.

Callable only by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newFee` | uint256 | The new fee in base units. |

### setTreasury

```solidity
function setTreasury(
    address payable newTreasury
) external
```

Sets the address that receives the fees.

Callable only by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newTreasury` | address payable | The new address of the treasury. |

### getFeeData

```solidity
function getFeeData() external returns (uint256 tokenFee, address payable treasuryAddress)
```

Gets both the fee and the treasury address for optimization purposes.

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenFee` | uint256 | The fee for the token in base units. |
| `treasuryAddress` | address payable | The address of the treasury. |

