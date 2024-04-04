// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CampaignFactory {
    Campaign[] private deployedCampaigns;
    
    event CampaignCreated(address campaignAddress, address creator);

    function createCampaign(uint minimum, uint goal) public {
        Campaign newCampaign = new Campaign(minimum, goal, payable(msg.sender));
        deployedCampaigns.push(newCampaign);
        emit CampaignCreated(address(newCampaign), msg.sender);
    }
    
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign is ReentrancyGuard {
    struct Donation {
        uint value;
        address donor;
    }

    address payable public manager;
    uint public minimumDonation;
    uint public goal;
    uint public totalDonations;
    bool public goalReached;
    mapping(address => Donation) public donations;
    address[] public donors;

    event GoalReached(uint totalDonations);
    event PartialFundsWithdrawn(uint amount, address recipient);

    constructor(uint minimum, uint campaignGoal, address payable creator) {
        manager = creator;
        minimumDonation = minimum;
        goal = campaignGoal;
        goalReached = false;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only the campaign manager can call this.");
        _;
    }

    // Allow donors to contribute to the campaign
    function donate() public payable nonReentrant {
        require(msg.value >= minimumDonation, "Donation below minimum requirement.");
        if(donations[msg.sender].value == 0) {
            donors.push(msg.sender);
        }
        donations[msg.sender].value += msg.value;
        totalDonations += msg.value;

        if(totalDonations >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(totalDonations);
        }
    }

    // Withdraw a portion of the funds immediately upon goal reach
    function immediateWithdraw(uint _percentage) public onlyManager nonReentrant {
        require(goalReached, "Goal not reached yet or partial withdrawal condition not met.");
        require(_percentage > 0 && _percentage <= 100, "Invalid withdrawal percentage.");
        uint amountToWithdraw = (address(this).balance * _percentage) / 100;
        manager.transfer(amountToWithdraw);
        emit PartialFundsWithdrawn(amountToWithdraw, manager);
    }

    // Withdraw the total funds once the campaign is successfully completed.
    function withdrawTotalFunds() public nonReentrant onlyManager {
        require(goalReached, "Goal not reached yet.");
        uint amount = address(this).balance;
        manager.transfer(amount);
        emit PartialFundsWithdrawn(amount, manager);
    }

    function getDonors() public view returns (address[] memory) {
        return donors;
    }

    // Refunds in case the campaign goal is not met
    function refund() public onlyManager {
        require(!goalReached, "Campaign goal was reached, cannot refund.");

        for(uint i = 0; i < donors.length; i++) {
            address payable donorAddress = payable(donors[i]);
            donorAddress.transfer(donations[donorAddress].value);
        }
    }
}