# IMaxSupply

## Functions

### maxSupply

```solidity
function maxSupply() external returns (uint256 count)
```

The maximum number of tokens that can ever be minted.

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `count` | uint256 | The number of tokens. |
### setMaxSupply

```solidity
function setMaxSupply(
    uint256 newMaxSupply
) external
```

Sets the maximum number of tokens that can ever be minted.

Only callable by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newMaxSupply` | uint256 | The number of tokens. |

## Events

### MaxSupplyChanged

```solidity
event MaxSupplyChanged(
    uint256 newMaxSupply
)
```

Event emitted when the maxSupply is changed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newMaxSupply` | uint256 | The number of tokens. |

## Custom errors

### MaxSupplyZero

```solidity
error MaxSupplyZero()
```

Error thrown when the maximum supply attempted to be set is zero.

### MaxSupplyReached

```solidity
error MaxSupplyReached(uint256 maxSupply)
```

Error thrown when the tokenId is higher than the maximum supply.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| maxSupply | uint256 | The maximum supply of the token. |

