import styles from '../styles/Contracts.module.css';
import ContractStatus from '../components/ContractStatus';
import TenderStatus from '../components/TenderStatus';
import BidForm from '../components/BidForm';
import { ethers } from 'ethers';
import factoryABI from '../artifacts/contracts/procurely.sol/ProcurelyFactory.json';
const { abi } = factoryABI;
import React, { useState, useEffect } from 'react';

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;

const Contracts = () => {
    const [isRightVisible, setIsRightVisible] = useState(false);
    const [contractAddress, setContractAddress] = useState(''); // State to hold the contract address
    const [tenderId, setTenderId] = useState(''); // State to hold the tender ID
    const [tenderAddresses, setTenderAddresses] = useState([]); // Array to hold tender addresses

    useEffect(() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(factoryAddress, abi, provider);

        const fetchTenderAddresses = async () => {
            const filter = factoryContract.filters.ProcurelyCreated(); 
            const events = await factoryContract.queryFilter(filter);
            const addresses = events.map(event => event.args.contractAddress); // Updated the property name based on actual event args
            setTenderAddresses(addresses);
        };

        fetchTenderAddresses();
    }, []);

    const onTenderClick = (contractAddress, tenderId) => {
        // Set the contract address and tender ID
        setContractAddress(contractAddress);
        setTenderId(tenderId);
    
        // Show styles.right
        setIsRightVisible(true);
      };

    return (
        <div className={styles.container}>
            <div className={styles.left} style={{ width: isRightVisible ? '50vw' : '100vw' }}>
                <h1 className={styles.title}>Procurements</h1>
                <div className={styles.campaignList}>
                    <div>
                        {/* Dynamically render ContractStatus for each tender */}
                        {tenderAddresses.map((address, index) => (
                            <ContractStatus
                                className = {styles.panel}
                                key = {index}
                                contractAddress={address}
                                onTenderClick={onTenderClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.right} style={{ display: isRightVisible ? 'block' : 'none' }}>
                <BidForm contractAddress={contractAddress} tenderId={tenderId}/>
                <TenderStatus contractAddress={contractAddress} tenderId={tenderId}/>
            </div>
        </div>
    );
}

export default Contracts;