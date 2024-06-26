import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/ContractList.module.css';
import factoryABI from '../artifacts/contracts/procurely.sol/ProcurelyFactory.json';
import procurelyABI from '../artifacts/contracts/procurely.sol/Procurely.json';
const factoryAbi = factoryABI.abi;
const procurelyAbi = procurelyABI.abi;

function ContractList({ onContractSelect, currentPath }) {

    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [contractName, setContractName] = useState('');
    const [newContractName, setNewContractName] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term

    async function createIssuerContract() {/*...*/ }

    async function getCreatorContracts() {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_FACTORY_ADDRESS, factoryAbi, signer);

            // Fetch all ProcurelyCreated events from the factory contract
            const filter = contract.filters.ProcurelyCreated();
            const events = await contract.queryFilter(filter);
            console.log('All events:', events);

            // Filter events based on the creator's address and fetch contract names
            const creatorContractsPromises = events
                .map(event => event.args)
                .filter(args => {
                    const hasIssuer = args.issuer === address;
                    console.log(`Event for contract ${args.contractAddress} has issuer: ${hasIssuer}`);
                    return hasIssuer;
                })
                .map(args => {
                    return (async () => {
                        try {
                            const contractInstance = new ethers.Contract(args.contractAddress, procurelyAbi, signer);
                            const contractName = await contractInstance.contractName();
                            console.log(`Contract ${args.contractAddress} has name: ${contractName}`);
                            return { address: args.contractAddress, name: contractName };
                        } catch (error) {
                            console.error(`Failed to get name for contract ${args.contractAddress}:`, error);
                        }
                    })();
                });

            const creatorContracts = await Promise.all(creatorContractsPromises);
            setContracts(creatorContracts);
        } catch (error) {
            console.error('Failed to get creator contracts:', error);
        }
    }

    // Handle contract button click
    async function handleContractClick(contractAddress) {
        setSelectedContract(contractAddress);
        // Call the callback function with the selected contract address
        const provider = new ethers.BrowserProvider(window.ethereum);

        const contract = new ethers.Contract(contractAddress, procurelyAbi, provider);
        const name = await contract.contractName();
        setContractName(name);
        onContractSelect(contractAddress);
    }

    useEffect(() => {
        if (window.ethereum) {
            getCreatorContracts();
        }
    }, []);

    // Filter contracts based on search term
    const filteredContracts = contracts.filter(contract =>
        contract.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Active Procurements</h1>
            <input
                type="text"
                placeholder="Search by contract name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchField}
            />
            {selectedContract && (
                <p className={styles.selectedContract}>Selected Procurement: {contractName}<br></br>{selectedContract}<br></br></p>
            )}
            <ul className={styles.contractList}>
                {filteredContracts.map(contract => {
                    console.log(contract); // Log the contract object to check its properties
                    return (contract &&
                        <li key={contract.address} className={styles.contractItem}>
                            <button className={styles.contractButton} onClick={() => handleContractClick(contract.address)}>
                                {contract.name}<br></br> ({contract.address})
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div className = {styles.newProcurement}>
                {currentPath !== '/dashboard' && (
                    <div>
                        <br></br>
                        New Procurement Name:
                        <br></br>
                        <textarea
                            className={styles.textarea}
                            value={newContractName}
                            onChange={(e) => setNewContractName(e.target.value)}
                        />
                        <br></br>

                        <button className={styles.createIssuerButton} onClick={createIssuerContract}>Create New Procurement</button>
                    </div>)}
            </div>
        </div>
    );
}

export default ContractList;