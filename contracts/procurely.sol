// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Procurely {

    address public issuer;
    string public contractName;
    uint[] public tenderIds;

    struct Bid {
        address bidder;
        uint amount;
        string details;
        bool isEvaluated;
        bool isWinner;
        string businessName;
    }

    struct Tender {
        string name;
        address issuer;
        uint deadline;
        string details;
        bool isClosed;
        uint bidCount;
        mapping(uint => Bid) bids;
        uint[] bidIds;
        uint tenderId;
    }

    mapping(uint => Tender) public tenders;
    uint public tenderCount;

    event TenderCreated(uint tenderId);
    event BidPlaced(uint tenderId, uint bidId);
    event TenderEvaluated(uint tenderId, uint winningBidId);

    // Set the contract creator as the authorized issuer
    constructor(address _issuer, string memory _contractName) {
        issuer = _issuer;
        contractName = _contractName;
    }

    modifier onlyIssuer() {
        require(msg.sender == issuer, "Not an issuer");
        _;
    }

    function createTender(string memory _details, uint deadline) public onlyIssuer() {
        uint newTenderId = tenderCount + 1;
        Tender storage newTender = tenders[newTenderId];
        newTender.issuer = issuer;
        newTender.details = _details;
        newTender.isClosed = false;
        newTender.bidCount = 0; // Initialize bidCount explicitly
        newTender.deadline = block.timestamp + deadline * 1 weeks;

        tenderCount = newTenderId;

        // Add the new tender ID to the tenderIds array
        tenderIds.push(newTenderId);

        emit TenderCreated(newTenderId);
    }

    struct TenderDetails {
        address issuer;
        string details;
        bool isClosed;
        uint deadline;
        uint bidCount;
    }

    function getTender(uint _tenderId) public view returns (TenderDetails memory) {
        Tender storage tender = tenders[_tenderId];
        return TenderDetails({
            issuer: tender.issuer,
            details: tender.details,
            isClosed: tender.isClosed,
            deadline: tender.deadline,
            bidCount: tender.bidCount
        });
    }

    function getAllTenders() public view returns (TenderDetails[] memory) {
        TenderDetails[] memory _tenders = new TenderDetails[](tenderIds.length);
        for (uint i = 0; i < tenderIds.length; i++) {
            Tender storage tender = tenders[tenderIds[i]];
            _tenders[i] = TenderDetails({
                issuer: tender.issuer,
                details: tender.details,
                isClosed: tender.isClosed,
                deadline: tender.deadline,
                bidCount: tender.bidCount
            });
        }
        return _tenders;
    }

    function placeBid(uint _tenderId, uint _amount, string memory _details, string memory _businessName) public {
        // Create the bid
        Bid memory newBid = Bid({
            bidder: msg.sender,
            amount: _amount,
            details: _details,
            isEvaluated: false,
            isWinner: false,
            businessName: _businessName
        });

        // Get the tender
        Tender storage tender = tenders[_tenderId];

        // Add the bid to the bids mapping
        tender.bids[tender.bidCount] = newBid;

        // Add the bid ID to the bidIds array
        tender.bidIds.push(tender.bidCount);

        // Increment the bid count
        tender.bidCount++;

        // Emit the BidPlaced event
        emit BidPlaced(_tenderId, tender.bidCount - 1);
    }

    function getBid(uint _tenderId, uint _bidId) public view returns (address, uint, string memory, bool, bool, string memory) {
        Bid memory bid = tenders[_tenderId].bids[_bidId];
        return (bid.bidder, bid.amount, bid.details, bid.isEvaluated, bid.isWinner, bid.businessName);
    }

    function getAllBids(uint _tenderId) public view returns (Bid[] memory) {
        Tender storage tender = tenders[_tenderId];
        Bid[] memory bids = new Bid[](tender.bidIds.length);
        for (uint i = 0; i < tender.bidIds.length; i++) {
            bids[i] = tender.bids[tender.bidIds[i]];
        }
        return bids;
    }



    function closeAndEvaluateTender(uint _tenderId) public onlyIssuer() {
        Tender storage tender = tenders[_tenderId];
        require(msg.sender == tender.issuer, "Only the issuer can close the tender");
        require(!tender.isClosed, "Tender already closed");
        tender.isClosed = true;

        uint highestBid = 0;
        uint winningBidId;
        for (uint i = 1; i <= tender.bidCount; i++) {
            if (tender.bids[i].amount > highestBid) {
                highestBid = tender.bids[i].amount;
                winningBidId = i;
            }
        }

        if (winningBidId > 0) {
            tender.bids[winningBidId].isWinner = true;
            emit TenderEvaluated(_tenderId, winningBidId);
        }
    }
}

contract ProcurelyFactory {
    // Mapping to keep track of which address created which Procurely contract
    mapping(address => address[]) public creatorContracts;
    
    // Event to announce a new Procurely contract creation
    event ProcurelyCreated(address indexed issuer, address contractAddress);

    // Function to create a new Procurely contract
    function createProcurely(string memory _contractName) public {
        address sender = msg.sender;
        Procurely newContract = new Procurely(sender, _contractName); // Pass the caller as the issuer
        creatorContracts[msg.sender].push(address(newContract));
        emit ProcurelyCreated(msg.sender, address(newContract));
    }

    // Function to get all Procurely contracts created by a specific user
    function getCreatorContracts(address _creator) public view returns (address[] memory) {
        return creatorContracts[_creator];
    }
}