// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundraisingCampaign {
    address public owner;
    address payable public receiver;
    uint256 public goal;
    uint256 public totalDonated;
    bool public goalReached;
    bool public immediateWithdrawal;

    enum CampaignMode { Escrow, Immediate }
    CampaignMode public mode;

    event DonationReceived(address donor, uint256 amount);
    event Withdrawn(uint256 amount);

    constructor(
        address payable _receiver,
        uint256 _goal,
        CampaignMode _mode
    ) {
        owner = msg.sender;
        receiver = _receiver;
        goal = _goal;
        mode = _mode;
        immediateWithdrawal = (_mode == CampaignMode.Immediate);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    modifier onlyReceiver() {
        require(msg.sender == receiver, "Only the receiver can call this function.");
        _;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0.");
        totalDonated += msg.value;
        emit DonationReceived(msg.sender, msg.value);

        if (totalDonated >= goal) {
            goalReached = true;
        }

        if (immediateWithdrawal) {
            withdraw();
        }
    }

    function withdraw() public onlyReceiver {
        require(totalDonated > 0, "No funds available for withdrawal.");
        if (mode == CampaignMode.Escrow) {
            require(goalReached, "Goal not reached. Funds are in escrow.");
        }

        uint256 amountToWithdraw = address(this).balance;
        receiver.transfer(amountToWithdraw);
        emit Withdrawn(amountToWithdraw);
    }

    // Function to check the balance of the contract
    function checkBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
