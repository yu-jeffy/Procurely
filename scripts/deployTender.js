   // Import ethers from Hardhat package
   const { ethers } = require("hardhat");

   async function main() {
     // Your deployed Procurely contract's address
     const procurelyAddress = "0x7160A10f767270E21564fE73A7CA2C2713889B06";

     // Assuming you have the compiled artifacts of your contract
     const ProcurelyArtifact = require("../artifacts/contracts/procurely.sol/Procurely.json");
     const procurelyAbi = ProcurelyArtifact.abi;

     // Prompt Hardhat to ask the user for the network to use
     const [deployer] = await ethers.getSigners();
   
     console.log("Using deployer address:", deployer.address);

     // Connect to your deployed contract
     const procurely = new ethers.Contract(procurelyAddress, procurelyAbi, deployer);

     // Call the createTender function with example details
     console.log("Creating a new tender...");
     const transaction = await procurely.createTender("Example tender details", 2);
     const receipt = await transaction.wait();

     console.log(`Tender created! Transaction Hash: ${receipt.transactionHash}`);
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error(error);
       process.exit(1);
     });