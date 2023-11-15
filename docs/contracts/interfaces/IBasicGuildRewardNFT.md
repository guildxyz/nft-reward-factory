# IBasicGuildRewardNFT

An NFT distributed as a reward for Guild.xyz users.

## Functions

### factoryProxy

```solidity
function factoryProxy() external returns (address factoryAddress)
```

The address of the proxy to be used when interacting with the factory.

Used to access the factory's address when interacting through minimal proxies.

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `factoryAddress` | address | The address of the factory. |
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
### initialize

```solidity
function initialize(
    string name,
    string symbol,
    string cid,
    address tokenOwner,
    address payable treasury,
    uint256 tokenFee,
    address factoryProxyAddress
) external
```

Sets metadata and the associated addresses.

Initializer function callable only once.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `name` | string | The name of the token. |
| `symbol` | string | The symbol of the token. |
| `cid` | string | The cid used to construct the tokenURI for the token to be minted. |
| `tokenOwner` | address | The address that will be the owner of the deployed token. |
| `treasury` | address payable | The address that will receive the price paid for the token. |
| `tokenFee` | uint256 | The price of every mint in wei. |
| `factoryProxyAddress` | address | The address of the factory. |

### claim

```solidity
function claim(
    address receiver,
    uint256 userId,
    bytes signature
) external
```

Claims tokens to the given address.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
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

