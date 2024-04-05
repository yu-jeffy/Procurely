import React, { useState } from 'react';
import styles from '../styles/CreateTenderForm.module.css';
import { ethers } from 'ethers';

// Define your contract artifacts and address here
const ProcurelyArtifact = require('../artifacts/contracts/procurely.sol/Procurely.json');
const { abi } = ProcurelyArtifact;

function CreateTenderForm( {contractAddress} ) {
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState('');

  async function submitTender() {
    try {
      // Use ethers to get the user's signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Connect to your deployed contract
      const procurely = new ethers.Contract(contractAddress, abi, signer);
      

      // Call the createTender function
      const transaction = await procurely.createTender(details, amount);
      await transaction.wait();

      alert('Tender created successfully!');
    } catch (error) {
      console.error(error);
      alert('There was an error creating your tender.');
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Tender</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input 
          type="text" 
          placeholder="Tender Details" 
          value={details} 
          onChange={(e) => setDetails(e.target.value)} 
          className={styles.inputField} 
        />
        <input 
          type="number" 
          placeholder="Expiration (weeks)" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className={styles.inputField} 
        />
        <button 
          type="submit" 
          className={styles.submitButton} 
          onClick={submitTender}>
          Create Tender
        </button>
      </form>
    </div>
  );
}

export default CreateTenderForm;