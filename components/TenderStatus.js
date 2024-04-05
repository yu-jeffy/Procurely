import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/TenderStatus.module.css';
import ABI from '../artifacts/contracts/procurely.sol/Procurely.json';
let abi = ABI.abi;

const TenderStatus = ({ contractAddress, tenderId }) => {
    const [bids, setBids] = useState([]);
    useEffect(() => {
        const fetchBids = async () => {
            if (contractAddress && contractAddress !== "" && tenderId) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);
                const bids = await contract.getAllBids(tenderId);
                setBids(bids);
                console.log(bids)
            }
        };

        fetchBids();
    }, [contractAddress, tenderId]);

    return (
        <div className={styles.tenderStatusContainer}>
            <h2 className={styles.tenderStatusHeader}>Active Tenders</h2>
            <p className={styles.contractAddressInfo}><strong>Contract Address:</strong> {contractAddress}</p>
            <p className={styles.tenderIdInfo}><strong>Tender ID:</strong> {tenderId}</p>
            <h3 className={styles.bidsHeader}>Bids</h3>
            {bids.length === 0 ? (
                <p>No bids found</p>
            ) : (
                bids.map((bid, index) => (
                    <div key={index} className={styles.bidContainer}>
                        <p className={styles.bidderInfo}><strong>Bidder:</strong> {bid.bidder}</p>
                        <p className={styles.bidAmountInfo}><strong>Amount:</strong> {Number(bid.amount)}</p>
                        <p className={styles.bidDetailsInfo}><strong>Details:</strong> {bid.details}</p>
                        <p className={styles.bidEvaluationStatus}><strong>Is Evaluated:</strong> {bid.isEvaluated ? 'Yes' : 'No'}</p>
                        <p className={styles.bidWinnerStatus}><strong>Is Winner:</strong> {bid.isWinner ? 'Yes' : 'No'}</p>
                        <p className={styles.bidBusinessName}><strong>Business Name:</strong> {bid.businessName}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default TenderStatus;