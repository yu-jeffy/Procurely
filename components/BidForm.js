import React, { useState } from 'react';
import { ethers } from 'ethers';
import ProcurelyArtifact from '../artifacts/contracts/procurely.sol/Procurely.json';
import styles from '../styles/BidForm.module.css';


const BidForm = ({ contractAddress, tenderId }) => {
    const [amount, setAmount] = useState('');
    const [details, setDetails] = useState('');
    const [businessName, setBusinessName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const procurelyAddress = contractAddress;
            const procurelyAbi = ProcurelyArtifact.abi;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const bidder = await provider.getSigner();

            const procurely = new ethers.Contract(procurelyAddress, procurelyAbi, bidder);

            const bidDetails = details;

            console.log(`Placing a bid on Tender #${tenderId}...`);
            const transaction = await procurely.placeBid(tenderId, amount, bidDetails, businessName);
            const receipt = await transaction.wait();

            console.log(`Bid placed! Transaction Hash: ${receipt.transactionHash}`);
        } catch (error) {
            console.error("Error placing bid:", error);
        }
    };

    return (
        <div className={styles.container}>
            <p className = {styles.title}>Create Bid</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    <span>Amount:</span>
                    <input type="text" value={amount} onChange={e => setAmount(e.target.value)} className={styles.input} />
                </label>
                <label className={styles.label}>
                    <span>Details:</span>
                    <input type="text" value={details} onChange={e => setDetails(e.target.value)} className={styles.input} />
                </label>
                <label className={styles.label}>
                    <span>Business Name:</span>
                    <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className={styles.input} />
                </label>
                <input type="submit" value="Submit" className={styles.submit} />
            </form>
        </div>
    );
}

export default BidForm;