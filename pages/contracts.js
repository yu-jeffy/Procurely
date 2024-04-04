import styles from '../styles/Contracts.module.css'
import CampaignStatus from '../components/CampaignStatus';
import { ethers } from 'ethers';
import factoryABI from '../abi/CampaignFactoryABI.json';
import React, { useState, useEffect } from 'react';

const factoryAddress = '0x6626A5bc9f19DCa28be96b78a3fea299175d3735';

const Campaigns = () => {

    const [campaignAddresses, setCampaignAddresses] = useState([]); // Array to hold campaign addresses

    useEffect(() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);

        const fetchCampaignAddresses = async () => {
            const filter = factoryContract.filters.CampaignCreated();
            const events = await factoryContract.queryFilter(filter);
            const addresses = events.map(event => event.args.campaignAddress);
            setCampaignAddresses(addresses);
        };

        fetchCampaignAddresses();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Campaigns</h1>
            <div className={styles.campaignList}>
                <div>
                    <h2>All Campaigns</h2>
                    {/* Dynamically render CampaignStatus for each campaign */}
                    {campaignAddresses.map((address, index) => (
                        <CampaignStatus key={index} campaignAddress={address} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Campaigns;