import styles from '../styles/Contracts.module.css';
import ContractStatus from '../components/ContractStatus';
import { ethers } from 'ethers';
import factoryABI from '../artifacts/contracts/procurely.sol/ProcurelyFactory.json';
const { abi } = factoryABI;
import React, { useState, useEffect } from 'react';

const factoryAddress = '0x00A76DaE1B17948FE91F37c06B4c81AD084383CB';

const Contracts = () => {
    const [tenderAddresses, setTenderAddresses] = useState([]); // Array to hold tender addresses

    useEffect(() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(factoryAddress, abi, provider);

        const fetchTenderAddresses = async () => {
            // Assuming the event name emitted by the contract on tender creation is 'TenderCreated'
            const filter = factoryContract.filters.ProcurelyCreated(); 
            const events = await factoryContract.queryFilter(filter);
            const addresses = events.map(event => event.args.contractAddress); // Updated the property name based on actual event args
            setTenderAddresses(addresses);
        };

        fetchTenderAddresses();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Procurely Tenders</h1>
            <div className={styles.campaignList}>
                <div>
                    <h2>All Tenders</h2>
                    {/* Dynamically render ContractStatus for each tender */}
                    {tenderAddresses.map((address, index) => (
                        <ContractStatus key={index} contractAddress={address} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Contracts;