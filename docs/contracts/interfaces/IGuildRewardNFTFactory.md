# IGuildRewardNFTFactory

A simple factory deploying minimal proxy contracts for Guild reward NFTs.

## Functions

### validSigner

```solidity
function validSigner() external returns (address signer)
```

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `signer` | address | The address that signs the metadata. |
### nftImplementations

```solidity
function nftImplementations(
    enum IGuildRewardNFTFactory.ContractType contractType
) external returns (address contractAddress)
```

Maps deployed implementation contract addresses to contract types.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `contractType` | enum IGuildRewardNFTFactory.ContractType | The type of the contract. |

#### Return Values

| Name | Type | Description |
| :--- | :--- | :---------- |
| `contractAddress` | address | The address of the deployed NFT contract. |
### initialize

```solidity
function initialize(
    address payable treasuryAddress,
    uint256 fee,
    address validSignerAddress
) external
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

## Events

### ImplementationChanged

```solidity
event ImplementationChanged(
    enum IGuildRewardNFTFactory.ContractType contractType,
    address newNFT
)
```

Event emitted when an NFT implementation is changed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `contractType` | enum IGuildRewardNFTFactory.ContractType | The type of the contract. |
| `newNFT` | address | The new address of the NFT implementation. |
### RewardNFTDeployed

```solidity
event RewardNFTDeployed(
    address deployer,
    address tokenAddress,
    enum IGuildRewardNFTFactory.ContractType contractType
)
```

Event emitted when a new NFT is deployed.

#### Parameters

| Name | Type | Description |
| :--- | :--- | :---------- |
| `deployer` | address | The address that deployed the token. |
| `tokenAddress` | address | The address of the token. |
| `contractType` | enum IGuildRewardNFTFactory.ContractType | The type of the NFT deployed. |
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

## Custom types

### ContractType

```solidity
enum ContractType {
  BASIC_NFT,
  CONFIGURABLE_NFT
}
```
### ConfigurableNFTConfig

```solidity
struct ConfigurableNFTConfig {
  string name;
  string symbol;
  string cid;
  address tokenOwner;
  address payable treasury;
  uint256 tokenFee;
  bool soulbound;
  uint256 maxSupply;
  uint256 mintableAmountPerUser;
}
```
### Deployment

```solidity
struct Deployment {
  address contractAddress;
  enum IGuildRewardNFTFactory.ContractType contractType;
}
```

