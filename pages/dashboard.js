import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import factoryABI from '../artifacts/contracts/procurely.sol/ProcurelyFactory.json';
const factoryAbi = factoryABI.abi;
import procurelyABI from '../artifacts/contracts/procurely.sol/Procurely.json';
const abi = procurelyABI.abi;
import styles from '../styles/Dashboard.module.css';
import ContractStatus from '../components/ContractStatus';

const Dashboard = () => {
    const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
    const [isRightVisible, setIsRightVisible] = useState(false);
    const [contractAddress, setContractAddress] = useState(''); // State to hold the contract address
    const [tenderId, setTenderId] = useState(''); // State to hold the tender ID
    const [tenderAddresses, setTenderAddresses] = useState([]); // Array to hold tender addresses



    useEffect(() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);
      
        const fetchTenderAddresses = async () => {
          try {
            const filter = factoryContract.filters.ProcurelyCreated();
            const events = await factoryContract.queryFilter(filter);
            const addresses = events.map(event => event.args.contractAddress);
            setTenderAddresses(addresses);
          } catch (error) {
            console.error("Failed to fetch tender addresses:", error);
          }
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

    const closeContract = async (tenderId) => {
        console.log('Closing and evaluating tender');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Assuming contractAddress and contractAbi are available
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const tx = await contract.closeAndEvaluateTender(tenderId);
            console.log('Transaction:', tx);
        } catch (error) {
            console.error('An error occurred while closing and evaluating the tender:', error.message);
        }
    };

    const handleContractClose = async () => {
        if (contractAddress && tenderId) {
            await closeContract(tenderId);
        }
    };

    // Button click handler
    const handleClick = () => {
        handleContractClose();
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1>Dashboard</h1>
            <div className={styles.content}>
                <div className={styles.campaignList}>
                    <div>
                        {/* Dynamically render ContractStatus for each tender */}
                        {tenderAddresses.map((address, index) => (
                            <ContractStatus
                                className={styles.panel}
                                key={index}
                                contractAddress={address}
                                onTenderClick={onTenderClick}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    Tender ID: {tenderId}
                    <input
                        type="text"
                        placeholder="Contract address"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className={styles.inputField}
                    />
                    <button onClick={() => closeContract(tenderId)} className={styles.closeButton}>Close Tender</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;