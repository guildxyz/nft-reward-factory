# BasicGuildRewardNFT

An NFT distributed as a reward for Guild.xyz users.

## Variables

### factoryProxy

```solidity
address factoryProxy
```

The address of the proxy to be used when interacting with the factory.

_Used to access the factory's address when interacting through minimal proxies._

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
    string name,
    string symbol,
    string _cid,
    address tokenOwner,
    address payable treasury,
    uint256 tokenFee,
    address factoryProxyAddress
) public
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `name` | string |  |
| `symbol` | string |  |
| `_cid` | string |  |
| `tokenOwner` | address |  |
| `treasury` | address payable |  |
| `tokenFee` | uint256 |  |
| `factoryProxyAddress` | address |  |

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

Whether a userId has claimed a token.

Used to prevent double claims in the same block.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `userId` | uint256 | The id of the user on Guild. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `claimed` | bool | Whether the userId has claimed any tokens. |
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
    address receiver,
    uint256 userId,
    bytes signature
) internal returns (bool)
```

Checks the validity of the signature for the given params.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `receiver` | address |  |
| `userId` | uint256 |  |
| `signature` | bytes |  |

