# IGuildRewardNFT

An NFT distributed as a reward for Guild.xyz users.

## Functions

### hasClaimed

```solidity
function hasClaimed(
    address account
) external returns (bool claimed)
```

Returns true if the address has already claimed their token.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `account` | address | The user's address. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `claimed` | bool | Whether the address has claimed their token. |
### hasTheUserIdClaimed

```solidity
function hasTheUserIdClaimed(
    uint256 userId
) external returns (bool claimed)
```

Whether a userId has minted a token.

Used to prevent double mints in the same block.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `userId` | uint256 | The id of the user on Guild. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `claimed` | bool | Whether the userId has claimed any tokens. |
### validSigner

```solidity
function validSigner() external returns (address signer)
```

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `signer` | address | The address that signs the metadata. |
### claim

```solidity
function claim(
    address payToken,
    address receiver,
    uint256 userId,
    bytes signature
) external
```

Claims tokens to the given address.

The contract needs to be approved if ERC20 tokens are used.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `payToken` | address | The address of the token that's used for paying the minting fees. 0 for ether. |
| `receiver` | address | The address that receives the token. |
| `userId` | uint256 | The id of the user on Guild. |
| `signature` | bytes | The following signed by validSigner: receiver, userId, chainId, the contract's address. |

### burn

```solidity
function burn(
    uint256 tokenId,
    uint256 userId,
    bytes signature
) external
```

Burns a token from the sender.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenId` | uint256 | The id of the token to burn. |
| `userId` | uint256 | The id of the user on Guild. |
| `signature` | bytes | The following signed by validSigner: receiver, userId, chainId, the contract's address. |

### updateTokenURI

```solidity
function updateTokenURI(
    string newCid
) external
```

Updates the cid for tokenURI.

Only callable by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newCid` | string | The new cid that points to the updated image. |

## Events

### Claimed

```solidity
event Claimed(
    address receiver,
    uint256 tokenId
)
```

Event emitted whenever a claim succeeds.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `receiver` | address | The address that received the tokens. |
| `tokenId` | uint256 | The id of the token. |
### MetadataUpdate

```solidity
event MetadataUpdate(
)
```

Event emitted whenever the cid is updated.

### ValidSignerChanged

```solidity
event ValidSignerChanged(
    address newValidSigner
)
```

Event emitted when the validSigner is changed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newValidSigner` | address | The new address of validSigner. |

## Custom errors

### AlreadyClaimed

```solidity
error AlreadyClaimed()
```

Error thrown when the token is already claimed.

### IncorrectFee

```solidity
error IncorrectFee(uint256 paid, uint256 requiredAmount)
```

Error thrown when an incorrect amount of fee is attempted to be paid.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| paid | uint256 | The amount of funds received. |
| requiredAmount | uint256 | The amount of fees required for minting. |

### IncorrectPayToken

```solidity
error IncorrectPayToken(address token)
```

Error thrown when such a token is attempted to be used for paying that has no fee set.

_The owner should set a fee for the token to solve this issue._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The address of the token that cannot be used. |

### IncorrectSender

```solidity
error IncorrectSender()
```

Error thrown when the sender is not permitted to do a specific action.

### IncorrectSignature

```solidity
error IncorrectSignature()
```

Error thrown when the supplied signature is invalid.

### NonExistentToken

```solidity
error NonExistentToken(uint256 tokenId)
```

Error thrown when trying to query info about a token that's not (yet) minted.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The queried id. |

