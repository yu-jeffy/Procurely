import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Login.module.css';

const Login = () => {
    const router = useRouter();
    const { status } = useAccount();

    useEffect(() => {
        if (status === 'connected') {
            router.push("/");
        }
    }, [status]);

    return (
        <div className={styles.container}>
            <h1 className={styles.text}>please sign in to enter the app</h1>
            <span className={styles.emoji}>⬇️</span>
            <ConnectButton />
        </div>
    );
};

export default Login;