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
          <h1 className={styles.navbarTitle}>giv3</h1>
        </Link> 
      </div>
      <div className = {styles.right}>
        <div className={styles.navbarLinkContainer}>
          <Link className={styles.navbarLink} href="/">Home</Link>
          <Link className={styles.navbarLink} href="/about">About</Link>
          {isConnected && (
            <>

              <Link className={styles.navbarLink} href="/campaigns">Campaigns</Link>
              <Link className={styles.navbarLink} href="/create">Create</Link>
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