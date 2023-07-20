# IGuildRewardNFTFactory

A simple factory deploying minimal proxy contracts for GuildRewardNFT.

## Functions

### nftImplementation

```solidity
function nftImplementation() external returns (address nft)
```

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `nft` | address | The address of the deployed NFT contract. |
### validSigner

```solidity
function validSigner() external returns (address signer)
```

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `signer` | address | The address that signs the metadata. |
### initialize

```solidity
function initialize(
    address payable treasuryAddress,
    address validSignerAddress
) external
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

### deployedTokenContracts

```solidity
function deployedTokenContracts(
    uint256 guildId
) external returns (address token)
```

Returns the reward NFT address for a guild.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `guildId` | uint256 | The id of the guild the NFT is deployed in. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `token` | address | The address of the token. |
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

## Events

### ImplementationChanged

```solidity
event ImplementationChanged(
    address newNFT
)
```

Event emitted when the NFT implementation is changed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `newNFT` | address | The new address of the NFT implementation. |
### RewardNFTDeployed

```solidity
event RewardNFTDeployed(
    uint256 guildId,
    address tokenAddress
)
```

Event emitted when a new NFT is deployed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `guildId` | uint256 | The id of the guild the NFT is deployed in. |
| `tokenAddress` | address | The address of the token. |
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

