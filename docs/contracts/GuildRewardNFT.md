# GuildRewardNFT

An NFT distributed as a reward for Guild.xyz users.

## Variables

### validSigner

```solidity
address validSigner
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### cid

```solidity
string cid
```

The cid for tokenURI.

## Functions

### initialize

```solidity
function initialize(
    string name,
    string symbol,
    address payable treasury,
    address payable _validSigner,
    string _cid
) public
```

Sets metadata and the associated addresses.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `name` | string | The name of the token. |
| `symbol` | string | The symbol of the token. |
| `treasury` | address payable | The address where the collected fees will be sent. |
| `_validSigner` | address payable | The address that should sign the parameters for certain functions. |
| `_cid` | string | The cid used to construct the tokenURI for the token to be minted. |

### claim

```solidity
function claim(
    address payToken,
    address receiver,
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
| `signature` | bytes | The following signed by validSigner: receiver, chainId, the contract's address. |

### burn

```solidity
function burn(
    uint256 tokenId
) external
```

Burns a token from the sender.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokenId` | uint256 | The id of the token to burn. |

### setValidSigner

```solidity
function setValidSigner(
    address newValidSigner
) external
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newValidSigner` | address |  |

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

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(
    address 
) internal
```

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `` | address |  |

### isValidSignature

```solidity
function isValidSignature(
    address receiver,
    bytes signature
) internal returns (bool)
```

Checks the validity of the signature for the given params.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `receiver` | address |  |
| `signature` | bytes |  |

