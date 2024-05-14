# OptionallySoulboundERC721

An enumerable ERC721 that&#x27;s optionally soulbound.

Allowance and transfer-related functions are disabled in soulbound mode.

Inheriting from upgradeable contracts here - even though we're using it in a non-upgradeable way,
we still want it to be initializable

## Variables

### soulbound

```solidity
bool soulbound
```

Whether the token is set as soulbound.

## Functions

### __OptionallySoulboundERC721_init

```solidity
function __OptionallySoulboundERC721_init(
    string name_,
    string symbol_,
    bool soulbound_
) internal
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `name_` | string |  |
| `symbol_` | string |  |
| `soulbound_` | bool |  |

### supportsInterface

```solidity
function supportsInterface(
    bytes4 interfaceId
) public returns (bool)
```

See {IERC165-supportsInterface}.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `interfaceId` | bytes4 |  |

### locked

```solidity
function locked(
    uint256 tokenId
) external returns (bool)
```

Returns the locking status of an Soulbound Token

SBTs assigned to zero address are considered invalid, and queries
about them do throw.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenId` | uint256 | The identifier for an SBT. |

### locked

```solidity
function locked() external returns (bool)
```

Whether all the tokens in the NFT are soulbound.

Added as a convenient alternative to locked(tokenId) that does not require a minted token.

### approve

```solidity
function approve(
    address to,
    uint256 tokenId
) public
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `to` | address |  |
| `tokenId` | uint256 |  |

### setApprovalForAll

```solidity
function setApprovalForAll(
    address operator,
    bool approved
) public
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `operator` | address |  |
| `approved` | bool |  |

### isApprovedForAll

```solidity
function isApprovedForAll(
    address owner,
    address operator
) public returns (bool)
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `owner` | address |  |
| `operator` | address |  |

### transferFrom

```solidity
function transferFrom(
    address from,
    address to,
    uint256 tokenId
) public
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `from` | address |  |
| `to` | address |  |
| `tokenId` | uint256 |  |

### safeTransferFrom

```solidity
function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
) public
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `from` | address |  |
| `to` | address |  |
| `tokenId` | uint256 |  |

### safeTransferFrom

```solidity
function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes data
) public
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `from` | address |  |
| `to` | address |  |
| `tokenId` | uint256 |  |
| `data` | bytes |  |

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
) internal
```

Used for minting/burning even when soulbound.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `from` | address |  |
| `to` | address |  |
| `firstTokenId` | uint256 |  |
| `batchSize` | uint256 |  |

## Modifiers

### checkSoulbound

```solidity
modifier checkSoulbound()
```

Reverts the function execution if the token is soulbound.

## Custom errors

### NonExistentToken

```solidity
error NonExistentToken(uint256 tokenId)
```

Error thrown when trying to query info about a token that's not (yet) minted.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The queried id. |

### Soulbound

```solidity
error Soulbound()
```

Error thrown when a function's execution is not possible, because the soulbound mode is on.

