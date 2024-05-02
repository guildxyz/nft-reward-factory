# ConfigurableGuildRewardNFT

An NFT distributed as a reward for Guild.xyz users.

## Variables

### SIGNATURE_VALIDITY

```solidity
uint256 SIGNATURE_VALIDITY
```

The time interval while a signature is valid.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### factoryProxy

```solidity
address factoryProxy
```

The address of the proxy to be used when interacting with the factory.

_Used to access the factory's address when interacting through minimal proxies._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### maxSupply

```solidity
uint256 maxSupply
```

The maximum number of tokens that can ever be minted.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### mintableAmountPerUser

```solidity
uint256 mintableAmountPerUser
```

The maximum amount of tokens a Guild user can claim from the token.

_Doesn't matter if they are claimed in the same transaction or separately._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### cid

```solidity
string cid
```

The cid for tokenURI.

### claimedTokens

```solidity
mapping(uint256 => uint256) claimedTokens
```

The number of claimed tokens by userIds.

## Functions

### initialize

```solidity
function initialize(
    struct IGuildRewardNFTFactory.ConfigurableNFTConfig nftConfig,
    address factoryProxyAddress
) public
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
    uint256 signedAt,
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
| `signedAt` | uint256 | The timestamp marking the time when the data were signed. |
| `signature` | bytes | The following signed by validSigner: amount, signedAt, receiver, userId, chainId, the contract's address. |

### burn

```solidity
function burn(
    uint256[] tokenIds,
    uint256 userId,
    uint256 signedAt,
    bytes signature
) external
```

Burns tokens from the sender.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenIds` | uint256[] | The tokenIds to burn. All of them should belong to userId. |
| `userId` | uint256 | The id of the user on Guild. |
| `signedAt` | uint256 | The timestamp marking the time when the data were signed. |
| `signature` | bytes | The following signed by validSigner: amount, signedAt, receiver, userId, chainId, the contract's address. |

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
| `newMaxSupply` | uint256 | The number of tokens. Unlimited if zero. |

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
### tokenURI

```solidity
function tokenURI(
    uint256 tokenId
) public returns (string)
```

See {IERC721Metadata-tokenURI}.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenId` | uint256 |  |

### isValidSignature

```solidity
function isValidSignature(
    uint256 amount,
    uint256 signedAt,
    address receiver,
    uint256 userId,
    bytes signature
) internal returns (bool)
```

Checks the validity of the signature for the given params.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `amount` | uint256 |  |
| `signedAt` | uint256 |  |
| `receiver` | address |  |
| `userId` | uint256 |  |
| `signature` | bytes |  |

