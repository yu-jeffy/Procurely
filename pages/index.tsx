import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  const texts: string[] = ["joy", "peace", "support", "love", "hope", "friendship", "life", "freedom", "courage", "inspiration"];
  const [currentText, setCurrentText] = useState<string>('');
  const [arrayIndex, setArrayIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // Function to handle typing animation
    const handleTyping = () => {
      const currentIndex: number = arrayIndex % texts.length;
      const fullText: string = texts[currentIndex];

      // Update currentText based on typing or deleting
      setCurrentText(currentText => isDeleting ?
        fullText.substring(0, currentText.length - 1) :
        fullText.substring(0, currentText.length + 1));

      // Adjust typing and deleting speeds
      const typingSpeed: number = isDeleting ? 100 : 50;

      // Check if currentText is fully typed or deleted
      if (!isDeleting && currentText === fullText) {
        // Wait for 1 second before starting deleting
        timer = setTimeout(() => { setIsDeleting(true); }, 1000);
      } else if (isDeleting && currentText === '') {
        // Switch to the next text in the array
        setIsDeleting(false);
        setArrayIndex(arrayIndex + 1);
      } else {
        // Continue typing or deleting
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };

    // Start typing animation after 300ms
    timer = setTimeout(handleTyping, 300);

    // Clean up timer on component unmount
    return () => clearTimeout(timer);
  }, [currentText, arrayIndex, isDeleting, texts]);

  return (
    <div className={styles.homeContainer}>
      {/* SVG Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1 }}>
        <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80" style={{ width: '100%', height: '100%' }}>
          <defs>
            <style>{`
              @keyframes rotate {
                 0% {
                      transform: rotate(0deg);
                  }
                  100% {
                      transform: rotate(360deg);
                  }
              }
              .out-top {
                  animation: rotate 20s linear infinite;
                  transform-origin: 13px 25px;
              }
              .in-top {
                  animation: rotate 10s linear infinite;
                  transform-origin: 13px 25px;
              }
              .out-bottom {
                  animation: rotate 25s linear infinite;
                  transform-origin: 84px 93px;
              }
              .in-bottom {
                  animation: rotate 15s linear infinite;
                  transform-origin: 84px 93px;
              }
          `}</style>
          </defs>
          <path fill="#bae1ff" className="out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" />
          <path fill="#ffffba" className="in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" />
          <path fill="#ffdfba" className="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" />
          <path fill="#ffb3ba" className="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" />
        </svg>
      </div>

      {/* Content */}
      <div className={styles.homeSection}>
        <h1 className={styles.mainText}>procure {currentText}</h1>
        <h2 className={styles.subText}>decentralized contract procurement</h2>
        <h2 className={styles.subText}>hosted on ethereum sepolia testnet</h2>
        {isConnected ? (
          <Link href="/campaigns">
            <button className={styles.subButton}>View Contracts</button>
          </Link>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ConnectButton />
            <h3 className={styles.subText}>Connect Wallet To Enter App</h3>
          </div>
        )}
      </div>
      {/* <div className={styles.homeSection}>
        <h2>this is section 2</h2>
      </div> */}
      {/* <div className={styles.homeSection}>
        <h2>this is section 3</h2>
      </div> */}

      <style jsx>{`
        .svgContainer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: -1;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #fbf7f5;
        }
      `}</style>
    </div>
  );
}

export default Home;