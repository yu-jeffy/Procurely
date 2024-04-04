// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CampaignFactory {
    Campaign[] private deployedCampaigns;
    
    event CampaignCreated(address campaignAddress, address creator);

    // Creates a new campaign with the specified minimum donation and goal
    function createCampaign(uint minimum, uint goal) public {
        Campaign newCampaign = new Campaign(minimum, goal, payable(msg.sender));
        deployedCampaigns.push(newCampaign);
        emit CampaignCreated(address(newCampaign), msg.sender);
    }
    
    // Returns an array of all deployed campaigns
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign is ReentrancyGuard {
    struct Donation {
        uint value;
        address donor;
    }

    address payable public manager; // Address of the campaign manager
    uint public minimumDonation; // Minimum donation amount required to participate in the campaign
    uint public goal; // Fundraising goal for the campaign
    uint public totalDonations; // Total amount of donations received
    bool public goalReached; // Flag indicating whether the fundraising goal has been reached
    mapping(address => Donation) public donations; // Mapping of donor addresses to their donations
    address[] public donors; // Array of donor addresses

    address payable public matchingFundsCompany; // Address of the matching funds company
    uint public matchingFundsTotal = 0; // Total amount of matching funds available
    uint public matchingFundsUsed = 0; // Total amount of matching funds already utilized

    event GoalReached(uint totalDonations); // Event emitted when the fundraising goal is reached
    event PartialFundsWithdrawn(uint amount, address recipient); // Event emitted when a partial fund withdrawal is made
    event MatchingFundsAdded(uint amount, address company); // Event emitted when matching funds are added
    event MatchingFundsUtilized(uint amount, address donor); // Event emitted when matching funds are utilized

    // Constructor to initialize the campaign with the minimum donation, goal, and creator address
    constructor(uint minimum, uint campaignGoal, address payable creator) {
        manager = creator;
        minimumDonation = minimum;
        goal = campaignGoal;
        goalReached = false;
    }

    // Modifier to restrict access to only the campaign manager
    modifier onlyManager() {
        require(msg.sender == manager, "Only the campaign manager can call this.");
        _;
    }
    
    // Modifier to restrict access to only the matching funds company
    modifier onlyMatchingFundsCompany() {
        require(msg.sender == matchingFundsCompany, "Only the matching funds company can call this.");
        _;
    }

    // Sets the address of the matching funds company
    function setMatchingFundsCompany(address payable companyAddress) public onlyManager {
        require(matchingFundsCompany == address(0), "Matching funds company already set.");
        matchingFundsCompany = companyAddress;
    }

    // Adds matching funds to the campaign
    function addMatchingFunds() public payable onlyMatchingFundsCompany {
        require(matchingFundsTotal == 0, "Matching funds can only be added once.");
        matchingFundsTotal += msg.value;
        emit MatchingFundsAdded(msg.value, msg.sender);
    }

    // Allows a donor to make a donation to the campaign
    function donate() public payable nonReentrant {
        require(msg.value >= minimumDonation, "Donation below minimum requirement.");
        
        uint matchedAmount = 0;
        if(matchingFundsTotal > matchingFundsUsed && matchingFundsCompany != address(0)) {
            matchedAmount = (msg.value <= matchingFundsTotal - matchingFundsUsed) ? msg.value : (matchingFundsTotal - matchingFundsUsed);
            matchingFundsUsed += matchedAmount;
            emit MatchingFundsUtilized(matchedAmount, msg.sender);
        }

        uint totalContribution = msg.value + matchedAmount;
        if(donations[msg.sender].value == 0) {
            donors.push(msg.sender);
        }
        donations[msg.sender].value += totalContribution;
        totalDonations += totalContribution;

        if(totalDonations >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(totalDonations);
        }
    }

    // Allows the campaign manager to make a partial fund withdrawal
    function immediateWithdraw(uint _percentage) public onlyManager nonReentrant {
        require(goalReached, "Goal not reached yet or partial withdrawal condition not met.");
        require(_percentage > 0 && _percentage <= 100, "Invalid withdrawal percentage.");
        uint amountToWithdraw = (address(this).balance * _percentage) / 100;
        manager.transfer(amountToWithdraw);
        emit PartialFundsWithdrawn(amountToWithdraw, manager);
    }

    // Allows the campaign manager to withdraw the total funds raised
    function withdrawTotalFunds() public nonReentrant onlyManager {
        require(goalReached, "Goal not reached yet.");
        uint amount = address(this).balance;
        manager.transfer(amount);
        emit PartialFundsWithdrawn(amount, manager);
    }

    // Allows the matching funds company to refund any unused matching funds
    function refundMatchingFunds() public onlyMatchingFundsCompany nonReentrant {
        require(matchingFundsTotal > matchingFundsUsed, "No funds to refund or already utilized.");
        uint refundAmount = matchingFundsTotal - matchingFundsUsed;
        matchingFundsCompany.transfer(refundAmount);
        // Reset matching funds and company to prevent re-entrancy issues and subsequent misuse
        matchingFundsTotal = 0;
        matchingFundsUsed = 0;
        matchingFundsCompany = payable(address(0));
    }

    // Returns an array of all donor addresses
    function getDonors() public view returns (address[] memory) {
        return donors;
    }

    // Allows the campaign manager to refund donations if the goal is not reached
    function refund() public onlyManager {
        require(!goalReached, "Campaign goal was reached, cannot refund.");

        for(uint i = 0; i < donors.length; i++) {
            address payable donorAddress = payable(donors[i]);
            donorAddress.transfer(donations[donorAddress].value);
        }
    }
}