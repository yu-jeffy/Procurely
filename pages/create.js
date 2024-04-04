import styles from '../styles/Create.module.css'
import CreateCampaignForm from '../components/CreateCampaignForm';
import React, { useEffect } from 'react';

const Create = () => {
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create Page</h1>
            <div>
                <h1>Create a New Campaign</h1>
                <CreateCampaignForm campaignFactoryAddress={"0x6626A5bc9f19DCa28be96b78a3fea299175d3735"} />
            </div>
        </div>
    );
}

export default Create;