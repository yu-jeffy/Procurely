import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractABI from '../artifacts/contracts/procurely.sol/Procurely.json';

const { abi } = ContractABI;

const ContractStatus = ({ contractAddress }) => {
  const [issuer, setIssuer] = useState('Loading...');
  const [tenderCount, setTenderCount] = useState('Loading...');
  const [tendersList, setTendersList] = useState([]);

  useEffect(() => {
    if (!contractAddress) {
      console.log('Contract address not provided');
      return;
    }

    const fetchContractStatus = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const issuerAddress = await contract.issuer();
        const totalTenders = await contract.tenderCount();

        setIssuer(issuerAddress);
        setTenderCount(totalTenders.toString());

        let tenders = [];
        for(let i = 1; i <= totalTenders; i++) {
          const tender = await contract.tenders(i);
          tenders.push({
            details: tender.details,
            deadline: new Date(Number(tender.deadline) * 1000).toLocaleString(),
            bidCount: tender.bidCount.toString(),
            isClosed: tender.isClosed
          });
        }

        setTendersList(tenders);
      } else {
        console.log('Ethereum wallet is not connected');
      }
    };

    fetchContractStatus();
  }, [contractAddress]);

  return (
    <div>
      <h2>Contract Status</h2>
      <p><strong>Issuer:</strong> {issuer}</p>
      <p><strong>Contract Address:</strong> {contractAddress}</p>
      <p><strong>Total Tenders:</strong> {tenderCount}</p>
      <h3>Tenders List</h3>
      {tendersList.length > 0 ? (
        <div>
          {tendersList.map((tender, index) => (
            <div key={index}>
              <p><strong>Description:</strong> {tender.details}</p>
              <p><strong>Deadline:</strong> {tender.deadline}</p>
              <p><strong>Bid Count:</strong> {tender.bidCount}</p>
              <p><strong>Is Closed:</strong> {tender.isClosed.toString()}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>No tenders found.</p>
      )}
    </div>
  );
};

export default ContractStatus;