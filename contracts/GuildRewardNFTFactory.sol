// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { IBasicGuildRewardNFT } from "./interfaces/IBasicGuildRewardNFT.sol";
import { IConfigurableGuildRewardNFT } from "./interfaces/IConfigurableGuildRewardNFT.sol";
import { IGuildRewardNFTFactory } from "./interfaces/IGuildRewardNFTFactory.sol";
import { TreasuryManager } from "./utils/TreasuryManager.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ClonesUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title A simple factory deploying minimal proxy contracts for Guild reward NFTs.
contract GuildRewardNFTFactory is
    IGuildRewardNFTFactory,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    TreasuryManager
{
    address public validSigner;

    // Mapping of contract types to their respective implementations
    mapping(ContractType => address) public nftImplementations;

    // Mapping of deployers to their deployed token contracts
    mapping(address => Deployment[]) internal deployedTokenContracts;

    /// @notice Empty space reserved for future updates.
    uint256[47] private __gap;

    /// @notice Initializes the contract with the treasury address, fee, and valid signer.
    function initialize(address payable treasuryAddress, uint256 fee, address validSignerAddress) public initializer {
        validSigner = validSignerAddress;
        __Ownable_init();
        __TreasuryManager_init(treasuryAddress, fee);
    }

    /// @notice Deploys a basic NFT contract.
    function deployBasicNFT(
        string calldata name,
        string calldata symbol,
        string calldata cid,
        address tokenOwner,
        address payable tokenTreasury,
        uint256 tokenFee
    ) external {
        ContractType contractType = ContractType.BASIC_NFT;
        address deployedCloneAddress = ClonesUpgradeable.clone(nftImplementations[contractType]);
        IBasicGuildRewardNFT deployedClone = IBasicGuildRewardNFT(deployedCloneAddress);

        deployedClone.initialize(name, symbol, cid, tokenOwner, tokenTreasury, tokenFee, address(this));

        deployedTokenContracts[msg.sender].push(
            Deployment({ contractAddress: deployedCloneAddress, contractType: contractType })
        );

        emit RewardNFTDeployed(msg.sender, deployedCloneAddress, contractType);
    }

    /// @notice Deploys a configurable NFT contract.
    function deployConfigurableNFT(ConfigurableNFTConfig memory nftConfig) external {
        ContractType contractType = ContractType.CONFIGURABLE_NFT;
        address deployedCloneAddress = ClonesUpgradeable.clone(nftImplementations[contractType]);
        IConfigurableGuildRewardNFT deployedClone = IConfigurableGuildRewardNFT(deployedCloneAddress);

        deployedClone.initialize(nftConfig, address(this));

        deployedTokenContracts[msg.sender].push(
            Deployment({ contractAddress: deployedCloneAddress, contractType: contractType })
        );

        emit RewardNFTDeployed(msg.sender, deployedCloneAddress, contractType);
    }

    /// @notice Sets the implementation address for a specific contract type.
    function setNFTImplementation(ContractType contractType, address newNFT) external onlyOwner {
        nftImplementations[contractType] = newNFT;
        emit ImplementationChanged(contractType, newNFT);
    }

    /// @notice Updates the valid signer address.
    function setValidSigner(address newValidSigner) external onlyOwner {
        validSigner = newValidSigner;
        emit ValidSignerChanged(newValidSigner);
    }

    /// @notice Retrieves all deployed token contracts for a given deployer address.
    function getDeployedTokenContracts(address deployer) external view returns (Deployment[] memory tokens) {
        return deployedTokenContracts[deployer];
    }

    /// @notice Authorization check for upgrades, only callable by the owner.
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
