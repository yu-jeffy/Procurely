import React, { useState } from 'react';
import { ethers } from 'ethers';
import CampaignABI from '../abi/CampaignABI.json';

const Donate = ({campaignAddress}) => {
  const [donationAmount, setDonationAmount] = useState('');

  const handleDonation = async (e) => {
    e.preventDefault(); 

    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Ethereum wallet.');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const campaign = new ethers.Contract(campaignAddress, CampaignABI, signer);
      
      // Convert the donation amount to the appropriate format (wei)
      const transactionResponse = await campaign.donate({
        value: ethers.parseEther(donationAmount)
      });

      await transactionResponse.wait(); // Wait for the transaction to be mined
      alert('Donation successful!');
      setDonationAmount('');
    } catch (err) {
      console.error('Donation error:', err);
      alert('Donation failed. Please, check the console for more details.');
    }
  };

  return (
    <div>
      <h2>Donate to Campaign</h2>
      <form onSubmit={handleDonation}>
        <label htmlFor="donationAmount">Donation Amount (ETH):</label>
        <input
          type="text"
          id="donationAmount"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          required
        />
        <button type="submit">Donate</button>
      </form>
    </div>
  );
};

export default Donate;
