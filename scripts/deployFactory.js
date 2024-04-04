// Importing ethers from Hardhat package
const { ethers, run } = require("hardhat");

async function main() {
    // The address of your factory contract
    const factoryAddress = "0x47D7afA80ebe0DcFB70aACbD43c6664F83f7c6F2";
    // Loading the factory contract using the factory ABI and the factory address
    const factoryABI = require("../artifacts/contracts/procurely.sol/ProcurelyFactory.json").abi;
    const factoryContract = await ethers.getContractAt(factoryABI, factoryAddress);

    // Listening for the ProcurelyCreated event
    factoryContract.on("ProcurelyCreated", async (issuer, contractAddress) => {
        console.log(`Procurely Contract Created! Issuer: ${issuer}, Address: ${contractAddress}`);
        // After detecting the event, we can remove the listener if no more contracts will be created.
        factoryContract.removeAllListeners("ProcurelyCreated");
    });

    // Before calling createProcurely, ensure the connected account is the one intended to be the issuer.
    console.log("Creating new Procurely contract from Factory...");
    
    // Estimate Gas for the transaction  
    const createProcurelyTx = await factoryContract.createProcurely();
    console.log("Awaiting confirmation...");
    const receipt = await createProcurelyTx.wait();
    
    if (receipt.status === 1) {
        console.log("Procurely Contract creation transaction succeeded.");
    } else {
        console.error("Procurely Contract creation transaction failed.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });