# GuildRewardNFTFactory

A simple factory deploying minimal proxy contracts for Guild reward NFTs.

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
mapping(address => struct IGuildRewardNFTFactory.Deployment[]) deployedTokenContracts
```

## Functions

### initialize

```solidity
function initialize(
    address payable treasuryAddress,
    uint256 fee,
    address validSignerAddress
) public
```

Sets the associated addresses.

Initializer function callable only once.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `treasuryAddress` | address payable | The address that will receive the fees. |
| `fee` | uint256 | The Guild base fee for every deployment. |
| `validSignerAddress` | address | The address that will sign the metadata. |

### deployBasicNFT

```solidity
function deployBasicNFT(
    string name,
    string symbol,
    string cid,
    address tokenOwner,
    address payable tokenTreasury,
    uint256 tokenFee
) external
```

Deploys a minimal proxy for a basic NFT.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `name` | string | The name of the NFT to be created. |
| `symbol` | string | The symbol of the NFT to be created. |
| `cid` | string | The cid used to construct the tokenURI of the NFT to be created. |
| `tokenOwner` | address | The address that will be the owner of the deployed token. |
| `tokenTreasury` | address payable | The address that will collect the prices of the minted tokens. |
| `tokenFee` | uint256 | The price of every mint in wei. |

### deployConfigurableNFT

```solidity
function deployConfigurableNFT(
    struct IGuildRewardNFTFactory.ConfigurableNFTConfig nftConfig
) external
```

Deploys a minimal proxy for a configurable NFT.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `nftConfig` | struct IGuildRewardNFTFactory.ConfigurableNFTConfig | The config to initialize the token to be deployed with. |

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
    address deployer
) external returns (struct IGuildRewardNFTFactory.Deployment[] tokens)
```

Returns the reward NFT addresses for a guild.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `deployer` | address | The address that deployed the tokens. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `tokens` | struct IGuildRewardNFTFactory.Deployment[] | The addresses of the tokens deployed by deployer. |
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

