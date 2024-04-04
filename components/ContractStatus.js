import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractABI from '../artifacts/contracts/procurely.sol/Procurely.json';
import styles from '../styles/ContractStatus.module.css';

const { abi } = ContractABI;

const ContractStatus = ({ contractAddress, onTenderClick }) => {
  const [issuer, setIssuer] = useState('Loading...');
  const [tenderCount, setTenderCount] = useState('Loading...');
  const [tendersList, setTendersList] = useState([]);
  const [tenders, setTenders] = useState([]);

    // pages/contracts.js
  useEffect(() => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factoryContract = new ethers.Contract(contractAddress, abi, provider);

      const fetchTenders = async () => {
          const tenders = await factoryContract.getAllTenders();
          setTenders(tenders);
      };

      fetchTenders();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contract Issuer</h2>
      <p className={styles.issuer}><strong>Issuer:</strong> {issuer}</p>
      <p className={styles.contractAddress}><strong>Contract Address:</strong> {contractAddress}</p>
      <p className={styles.tenderCount}><strong>Total Tenders:</strong> {tenders.length}</p>
      <h3 className={styles.tendersListTitle}>Tenders List</h3>
      {tenders.length > 0 ? (
        <div className={styles.tendersList}>
          {tenders.map((tender, index) => (
            <div key={index} onClick={() => onTenderClick(contractAddress, index + 1)} className={styles.tenderItem}>
              <p className={styles.tenderDetails}><strong>Description:</strong> {tender.details}</p>
              <p className={styles.tenderDeadline}><strong>Deadline:</strong> {new Date(Number(tender.deadline) * 1000).toLocaleString()}</p>
              <p className={styles.bidCount}><strong>Bid Count:</strong> {tender.bidCount}</p>
              <p className={styles.isClosed}><strong>Is Closed:</strong> {tender.isClosed.toString()}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noTenders}>No tenders found.</p>
      )}
    </div>
  );
}

export default ContractStatus;