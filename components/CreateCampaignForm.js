import React, { useState } from 'react';
import { ethers } from 'ethers';
import CampaignFactoryABI from '../abi/CampaignFactoryABI.json';

const CreateCampaignForm = ({ campaignFactoryAddress }) => {
  const [minimumDonation, setMinimumDonation] = useState('');
  const [goal, setGoal] = useState('');
  const [newCampaignAddress, setNewCampaignAddress] = useState('');

  const createCampaign = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!window.ethereum) {
      alert('Make sure you have MetaMask installed!');
      return;
    }

    try {
      // Instantiate BrowserProvider with the injected Ethereum provider
      const browserProvider = new ethers.BrowserProvider(window.ethereum);

      // Get signer for transactions
      const signer = await browserProvider.getSigner();

      const campaignFactory = new ethers.Contract(
        campaignFactoryAddress,
        CampaignFactoryABI,
        signer
      );

      // Convert string values to BigInt using ethers.utils.parseEther
      const minDonationBigInt = ethers.parseEther(minimumDonation);
      const goalBigInt = ethers.parseEther(goal);

      // Send transaction
      const transactionResponse = await campaignFactory.createCampaign(minDonationBigInt, goalBigInt);
      await transactionResponse.wait(); // Wait for the transaction to be mined

      // Assuming the event `CampaignCreated` is emitted, we would fetch the transaction receipt to access the events
      const receipt = await transactionResponse.wait();
      const campaignCreatedEvent = receipt.events?.find(event => event.event === 'CampaignCreated');

      if (campaignCreatedEvent) {
        const newCampaignAddress = campaignCreatedEvent.args.newCampaignAddress;
        console.log('New campaign address:', newCampaignAddress);
        alert(`Campaign created successfully at address: ${newCampaignAddress}`);
        setNewCampaignAddress(newCampaignAddress);  // This sets your state variable
      }

      alert('Campaign created successfully!');
      setMinimumDonation('');
      setGoal('');
    } catch (err) {
      console.error('Error creating campaign:', err);
      alert('Failed to create campaign.');
    }
  };

  return (
    <div>
      <form onSubmit={createCampaign}>
        <div>
          <label htmlFor="minimumDonation">Minimum Donation (ETH):</label>
          <textarea
            id="minimumDonation"
            value={minimumDonation}
            onChange={(e) => setMinimumDonation(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="goal">Goal (ETH):</label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Campaign</button>
      </form>
      {newCampaignAddress && <p>New Campaign Address: {newCampaignAddress}</p>}
    </div>
  );
};

export default CreateCampaignForm;