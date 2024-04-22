# IConfigurableGuildRewardNFT

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
### mintableAmountPerUser

```solidity
function mintableAmountPerUser() external returns (uint256 mintableAmountPerUser)
```

The maximum amount of tokens a Guild user can claim from the token.

Doesn't matter if they are claimed in the same transaction or separately.

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `mintableAmountPerUser` | uint256 | The amount of tokens. |
### balanceOf

```solidity
function balanceOf(
    uint256 userId
) external returns (uint256 amount)
```

Returns the number of tokens the user claimed.

Analogous to balanceOf(address), but works with Guild user ids.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `userId` | uint256 | The id of the user on Guild. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `amount` | uint256 | The number of tokens the userId has claimed. |
### initialize

```solidity
function initialize(
    struct IGuildRewardNFTFactory.ConfigurableNFTConfig nftConfig,
    address factoryProxyAddress
) external
```

Sets metadata and the associated addresses.

Initializer function callable only once.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `nftConfig` | struct IGuildRewardNFTFactory.ConfigurableNFTConfig | See struct ConfigurableNFTConfig in IGuildRewardNFTFactory. |
| `factoryProxyAddress` | address | The address of the factory. |

### claim

```solidity
function claim(
    uint256 amount,
    address receiver,
    uint256 userId,
    bytes signature
) external
```

Claims tokens to the given address.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `amount` | uint256 | The amount of tokens to mint. Should be less or equal to mintableAmountPerUser. |
| `receiver` | address | The address that receives the token. |
| `userId` | uint256 | The id of the user on Guild. |
| `signature` | bytes | The following signed by validSigner: amount, receiver, userId, chainId, the contract's address. |

### burn

```solidity
function burn(
    uint256[] tokenIds,
    uint256 userId,
    bytes signature
) external
```

Burns tokens from the sender.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenIds` | uint256[] | The tokenIds to burn. All of them should belong to userId. |
| `userId` | uint256 | The id of the user on Guild. |
| `signature` | bytes | The following signed by validSigner: amount, receiver, userId, chainId, the contract's address. |

### setLocked

```solidity
function setLocked(
    bool newLocked
) external
```

Sets the locked (i.e. soulboundness) status of all of the tokens in this NFT.

Only callable by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newLocked` | bool | Whether the token should be soulbound or not. |

### setMintableAmountPerUser

```solidity
function setMintableAmountPerUser(
    uint256 newAmount
) external
```

Sets the amount of tokens a user can mint from the token.

Only callable by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newAmount` | uint256 | The new amount a user can mint from the token. |

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

### MintableAmountPerUserChanged

```solidity
event MintableAmountPerUserChanged(
    uint256 newAmount
)
```

Event emitted when the mintableAmountPerUser is changed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newAmount` | uint256 | The new amount a user can mint from the token. |

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
| requiredAmount | uint256 | The amount of fees required for claiming a single token. |

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

