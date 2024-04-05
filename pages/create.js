import styles from '../styles/Create.module.css'
import ContractList from '../components/ContractList';
import CreateTenderForm from '../components/CreateTenderForm';
import ContractStatus from '../components/ContractStatus';
import React, { useState, useEffect } from 'react';
import TenderStatus from '../components/TenderStatus';

const Create = () => {
    const [selectedContract, setSelectedContract] = useState("");
    const [tenderId, setTenderId] = useState(''); // State to hold the tender ID


    function handleContractSelect(contractAddress) {
        setSelectedContract(contractAddress);
    }

    const onTenderClick = (contractAddress, tenderId) => {
        setSelectedContract(contractAddress);
        setTenderId(tenderId);
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.panel} >
                <ContractList onContractSelect={handleContractSelect} />
            </div>
            <div className={styles.panel} >
                {selectedContract === "" ? (
                    <p className={styles.noSelectText} >Select an active contract or create a new contract to view tenders.</p>
                ) : (
                    <ContractStatus contractAddress={selectedContract} onTenderClick={onTenderClick}/>
                )}
            </div>
            <div className={styles.panel} >
                {selectedContract === "" ? (
                        <p className={styles.noSelectText} >Select an active contract or create a new contract to create a tender.</p>
                    ) : (
                        <div>
                            <CreateTenderForm contractAddress={selectedContract} />
                            <TenderStatus contractAddress={selectedContract} tenderId={tenderId} ></TenderStatus>
                        </div>
                    )}

            </div>
        </div>
    );
}

export default Create;