// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's Ownable contract to manage ownership
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Factory Contract
contract CampaignFactory is Ownable {
    Campaign[] private deployedCampaigns;

    // Deploy a new campaign
    function createCampaign(uint minimum, uint goal) public {
        Campaign newCampaign = new Campaign(minimum, goal, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    // Get deployed campaigns
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

// Individual Campaign Contract
contract Campaign is ReentrancyGuard {
    struct Donation {
        uint value;
        address donor;
    }

    address public manager;
    uint public minimumDonation;
    uint public goal;
    uint public totalDonations;
    mapping(address => Donation) public donations;
    address[] public donors;

    // Constructor to create a new Campaign
    constructor(uint minimum, uint campaignGoal, address creator) {
        manager = creator;
        minimumDonation = minimum;
        goal = campaignGoal;
    }

    // Donate to the campaign
    function donate() public payable nonReentrant {
        require(msg.value >= minimumDonation, "Donation does not meet minimum requirement.");

        // Update donation mapping and total donations
        if(donations[msg.sender].value == 0) {
            donors.push(msg.sender); // Add new donor
        }
        donations[msg.sender].value += msg.value;
        totalDonations += msg.value;
    }

    // Refund all donations if goal is not met
    function refund() public onlyManager {
        require(totalDonations < goal, "Campaign goal reached or exceeded, cannot refund.");

        for(uint i=0; i<donors.length; i++) {
            address payable donorAddress = payable(donors[i]);
            donorAddress.transfer(donations[donorAddress].value);
        }
    }

    // Modifier to restrict actions to the manager only
    modifier onlyManager() {
        require(msg.sender == manager, "Only the campaign manager can call this.");
        _;
    }

    // Allow querying of donor addresses
    function getDonors() public view returns (address[] memory) {
        return donors;
    }
}