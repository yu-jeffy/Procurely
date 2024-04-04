const { ethers } = require("hardhat");
const ProcurelyArtifact = require("../artifacts/contracts/procurely.sol/Procurely.json");

// Import ethers from Hardhat package

async function main() {
    try {
        // Your deployed Procurely contract's address
        const procurelyAddress = "0x7160A10f767270E21564fE73A7CA2C2713889B06";

        // Assuming you have the compiled artifacts of your contract
        const procurelyAbi = ProcurelyArtifact.abi;

        // Prompt Hardhat to ask the user for the network to use
        const [bidder] = await ethers.getSigners();

        console.log("Using bidder address:", bidder.address);

        // Connect to your deployed contract
        const procurely = new ethers.Contract(procurelyAddress, procurelyAbi, bidder);

        // Tender ID for which the bid is to be placed
        const tenderId = 1; // assuming there is already a tender with ID #1
        // Bid details
        const bidAmount = 1000000; 
        const bidDetails = "Example bid details";
        const businessName = "Example Business Name";

        console.log(`Placing a bid on Tender #${tenderId}...`);
        const transaction = await procurely.placeBid(tenderId, bidAmount, bidDetails, businessName);
        const receipt = await transaction.wait();

        console.log(`Bid placed! Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("Error placing bid:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });