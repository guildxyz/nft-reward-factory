# ITreasuryManager

A contract that manages fee-related functionality.

## Functions

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

### fee

```solidity
function fee() external returns (uint256 fee)
```

The base minting fee of a token.

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `fee` | uint256 | The amount of the fee in base units. |
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

### getFeeWithOverrides

```solidity
function getFeeWithOverrides(
    address tokenAddress
) external returns (uint256 tokenFee)
```

The minting fee of a token for a specific caller.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenAddress` | address | The address of the token. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenFee` | uint256 | The fee for the token in base units. |
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
### treasury

```solidity
function treasury() external returns (address payable)
```

Returns the address that receives the fees.

## Events

### FeeChanged

```solidity
event FeeChanged(
    uint256 newFee
)
```

Event emitted when a token's fee is changed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newFee` | uint256 | The new amount of fee in base units. |
### FeeOverrideChanged

```solidity
event FeeOverrideChanged(
    address tokenAddress,
    uint256 newFee
)
```

Event emitted when a fee override is set.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenAddress` | address | The address of the token. |
| `newFee` | uint256 | The new fee amount in base units. |
### TreasuryChanged

```solidity
event TreasuryChanged(
    address newTreasury
)
```

Event emitted when the treasury address is changed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newTreasury` | address | The new address of the treasury. |

