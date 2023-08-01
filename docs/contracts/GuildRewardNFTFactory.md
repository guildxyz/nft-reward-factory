# GuildRewardNFTFactory

A simple factory deploying minimal proxy contracts for GuildRewardNFT.

## Variables

### validSigner

```solidity
address validSigner
```

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### nftImplementations

```solidity
mapping(enum IGuildRewardNFTFactory.ContractType => address) nftImplementations
```

Maps deployed implementation contract addresses to contract types.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |

### deployedTokenContracts

```solidity
mapping(uint256 => struct IGuildRewardNFTFactory.Deployment[]) deployedTokenContracts
```

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
    enum IGuildRewardNFTFactory.ContractType contractType,
    address newNFT
) external
```

Sets the address of the contract where a specific NFT is implemented.

Callable only by the owner.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `contractType` | enum IGuildRewardNFTFactory.ContractType | The type of the contract. |
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

### getDeployedTokenContracts

```solidity
function getDeployedTokenContracts(
    uint256 guildId
) external returns (struct IGuildRewardNFTFactory.Deployment[] tokens)
```

Returns the reward NFT addresses for a guild.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `guildId` | uint256 | The id of the guild the NFTs are deployed in. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokens` | struct IGuildRewardNFTFactory.Deployment[] | The addresses of the tokens deployed for guildId. |
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

