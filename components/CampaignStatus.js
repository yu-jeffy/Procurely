import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CampaignABI from '../abi/CampaignABI.json';
import Donate from './Donate';

const CampaignStatus = ({ campaignAddress }) => {
  const [goal, setGoal] = useState('Loading...');
  const [totalDonations, setTotalDonations] = useState('Loading...');
  const [goalReached, setGoalReached] = useState('Loading...');
  const [minimumDonation, setMinimumDonation] = useState('Loading...');

  useEffect(() => {
    if (!campaignAddress) {
      console.log('Address not provided');
      return;
    }

    const fetchCampaignStatus = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const campaignContract = new ethers.Contract(campaignAddress, CampaignABI, provider);

        const goal = await campaignContract.goal();
        const totalDonations = await campaignContract.totalDonations();
        const goalReachedStatus = await campaignContract.goalReached();
        const minimumDonation = await campaignContract.minimumDonation();

        setGoal(ethers.formatEther(goal));
        setTotalDonations(ethers.formatEther(totalDonations));
        setGoalReached(goalReachedStatus.toString());
        setMinimumDonation(ethers.formatEther(minimumDonation));
      } else {
        console.log('Ethereum wallet is not connected');
      }
    };

    fetchCampaignStatus();
  }, [campaignAddress]);

  return (
    <div>
      <h2>Campaign Status</h2>
      <p>
        <strong>Goal (ETH):</strong> {goal}
      </p>
      <p>
        <strong>Total Donations (ETH):</strong> {totalDonations}
      </p>
      <p>
        <strong>Goal Reached:</strong> {goalReached}
      </p>
      <p>
        <strong>Minimum Donation (ETH):</strong> {minimumDonation}
      </p>
      <Donate campaignAddress={campaignAddress} />
    </div>
  );
};

export default CampaignStatus;