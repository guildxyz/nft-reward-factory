# GuildRewardNFTFactory

A simple factory deploying minimal proxy contracts for GuildRewardNFT.

## Variables

### nftImplementation

```solidity
address nftImplementation
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### validSigner

```solidity
address validSigner
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### deployedTokenContracts

```solidity
mapping(uint256 => address) deployedTokenContracts
```

Returns the reward NFT address for a guild.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

## Functions

### initialize

```solidity
function initialize(
    address payable treasuryAddress,
    address validSignerAddress
) public
```

Sets the associated addresses.

Initializer function callable only once.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `treasuryAddress` | address payable | The address that will receive the fees. |
| `validSignerAddress` | address | The address that will sign the metadata. |

### clone

```solidity
function clone(
    uint256 guildId,
    string name,
    string symbol,
    string cid,
    address tokenOwner
) external
```

Deploys a minimal proxy for the NFT.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `guildId` | uint256 | The id of the guild the NFT is deployed in. |
| `name` | string | The name of the NFT to be created. |
| `symbol` | string | The symbol of the NFT to be created. |
| `cid` | string | The cid used to construct the tokenURI of the NFT to be created. |
| `tokenOwner` | address | The address that will be the owner of the deployed token. |

### setNFTImplementation

```solidity
function setNFTImplementation(
    address newNFT
) external
```

Sets the address of the contract where the NFT is implemented.

Callable only by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newNFT` | address | The address of the deployed NFT contract. |

### setValidSigner

```solidity
function setValidSigner(
    address newValidSigner
) external
```

Sets the address that signs the metadata.

Callable only by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newValidSigner` | address | The new address of validSigner. |

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

