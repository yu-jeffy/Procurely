import styles from '../styles/Create.module.css'
import ContractList from '../components/ContractList';
import CreateTenderForm from '../components/CreateTenderForm';
import React, { useState, useEffect } from 'react';

const Create = () => {
    const [selectedContract, setSelectedContract] = useState(null);

    function handleContractSelect(contractAddress) {
        setSelectedContract(contractAddress);
    }
    
    return (
        <div className={styles.container}>
            <div>
                <ContractList onContractSelect={handleContractSelect} />
            </div>
            <div>
                <CreateTenderForm contractAddress={selectedContract} />
            </div>
        </div>
    );
}

export default Create;