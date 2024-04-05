import React from 'react';
import Link from 'next/link';
import styles from '../styles/NavBar.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const NavBar = () => {
  const { isConnected } = useAccount();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <Link href="/">
          <h1 className={styles.navbarTitle}>procurely</h1>
        </Link> 
      </div>
      <div className = {styles.right}>
        <div className={styles.navbarLinkContainer}>
          <Link className={styles.navbarLink} href="/">Home</Link>
          <Link className={styles.navbarLink} href="/about">About</Link>
          <Link className={styles.navbarLink} href="https://parallelpolis.gitbook.io/procurely/">Docs</Link>
          {isConnected && (
            <>

              <Link className={styles.navbarLink} href="/contracts">Contracts</Link>
              <Link className={styles.navbarLink} href="/create">Create</Link>
              <Link className={styles.navbarLink} href="/dashboard">Dashboard</Link>
            </>
          )}
        </div>
        <div className={styles.navbarConnect}>
          <ConnectButton className={styles.navbarConnect}/>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;