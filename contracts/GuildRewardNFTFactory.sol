//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { IBasicGuildRewardNFT } from "./interfaces/IBasicGuildRewardNFT.sol";
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

    mapping(ContractType contractType => address contractAddress) public nftImplementations;
    mapping(address deployer => Deployment[] tokens) internal deployedTokenContracts;

    /// @notice Empty space reserved for future updates.
    uint256[47] private __gap;

    function initialize(address payable treasuryAddress, uint256 fee, address validSignerAddress) public initializer {
        validSigner = validSignerAddress;
        __Ownable_init();
        __TreasuryManager_init(treasuryAddress, fee);
    }

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

    function setNFTImplementation(ContractType contractType, address newNFT) external onlyOwner {
        nftImplementations[contractType] = newNFT;
        emit ImplementationChanged(contractType, newNFT);
    }

    function setValidSigner(address newValidSigner) external onlyOwner {
        validSigner = newValidSigner;
        emit ValidSignerChanged(newValidSigner);
    }

    function getDeployedTokenContracts(address deployer) external view returns (Deployment[] memory tokens) {
        return deployedTokenContracts[deployer];
    }

    // solhint-disable-next-line no-empty-blocks
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
