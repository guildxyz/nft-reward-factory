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

The base minting fee of a token.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### _feeOverrides

```solidity
mapping(address => uint256) _feeOverrides
```

Fee overrides to be able to discount fees for specific guilds.

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

### setFeeOverride

```solidity
function setFeeOverride(
    address tokenAddress,
    uint256 newFee
) external
```

Sets the fee override for a specific token.

Callable only by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenAddress` | address | The address of the token. |
| `newFee` | uint256 | The new fee amount in base units. |

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

### getFeeWithOverrides

```solidity
function getFeeWithOverrides(
    address tokenAddress
) public returns (uint256)
```

The minting fee of a token for a specific caller.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenAddress` | address | The address of the token. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `[0]` | uint256 |  |
### getFeeData

```solidity
function getFeeData() external returns (uint256 tokenFee, address payable treasuryAddress)
```

Gets both the fee and the treasury address for optimization purposes.

Gets the fee for the caller - might only make sense to call it from a contract.

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenFee` | uint256 | The fee for the token in base units. |
| `treasuryAddress` | address payable | The address of the treasury. |

