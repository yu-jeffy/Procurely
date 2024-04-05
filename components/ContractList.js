import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/ContractList.module.css';
import factoryABI from '../artifacts/contracts/procurely.sol/ProcurelyFactory.json';
const { abi } = factoryABI;

function ContractList({ onContractSelect }) {
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);

    async function createIssuerContract() {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FACTORY_ADDRESS, abi, signer);

            // Listen for the ProcurelyCreated event
            contract.on("ProcurelyCreated", (issuer, contractAddress) => {
                console.log(`Procurely Contract Created! Issuer: ${issuer}, Address: ${contractAddress}`);
                // After detecting the event, we can remove the listener if no more contracts will be created.
                contract.removeAllListeners("ProcurelyCreated");
            });

            console.log("Creating new Procurely contract from Factory...");

            // Call the createProcurely function
            const transaction = await contract.createProcurely();
            console.log("Awaiting confirmation...");
            const receipt = await transaction.wait();

            if (receipt.status === 1) {
                console.log("Procurely Contract creation transaction succeeded.");
                // Refresh the list of contracts
                getCreatorContracts();
            } else {
                console.error("Procurely Contract creation transaction failed.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function getCreatorContracts() {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FACTORY_ADDRESS, abi, signer);

            // Fetch all ProcurelyCreated events from the factory contract
            const filter = contract.filters.ProcurelyCreated();
            const events = await contract.queryFilter(filter);

            // Filter events based on the creator's address
            const creatorContracts = events
                .map(event => event.args)
                .filter(args => args.issuer === address)
                .map(args => args.contractAddress);

            setContracts(creatorContracts);
        } catch (error) {
            console.error(error);
        }
    }

    // Handle contract button click
    function handleContractClick(contractAddress) {
        setSelectedContract(contractAddress);
        // Call the callback function with the selected contract address
        onContractSelect(contractAddress);
    }

    useEffect(() => {
        if (window.ethereum) {
            getCreatorContracts();
        }
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Active Contracts</h1>
            <ul className={styles.contractList}>
                {contracts.map(contractAddress => (
                    <li key={contractAddress} className={styles.contractItem}>
                        <button className={styles.contractButton} onClick={() => handleContractClick(contractAddress)}>
                            {contractAddress}
                        </button>
                    </li>
                ))}
            </ul>
            {selectedContract && (
                <p className={styles.selectedContract}>Selected Contract: {selectedContract}</p>
            )}
            <button className={styles.createIssuerButton} onClick={createIssuerContract}>Create New Contract</button>
        </div>
    );
}

export default ContractList;