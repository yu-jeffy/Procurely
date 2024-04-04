import React from 'react';
import Image from 'next/image';
import styles from '../styles/About.module.css';

const About = () => {

    return (
        <div className={styles.container}>
            <div className={styles.textContainer}>
                <h1 className={styles.title}>About</h1>
                <p className={styles.text}>Welcome to Procurely, where we're transforming the way government contracts are discovered, bid on, and awarded. At the heart of our mission is the belief that transparency isn't just a buzzword—it's the cornerstone of trust and efficiency in public procurement.
                    &nbsp;<br></br><br></br>
                    Born from a vision to cut through the red tape and murky waters of traditional bidding processes, Procurely harnesses the power of blockchain technology to bring clarity and fairness to government contracts. Our platform isn't just a marketplace; it's a movement towards democratizing access to public sector opportunities, ensuring that businesses of all sizes have a fair shot at contributing to their communities.
                    &nbsp;<br></br><br></br>
                    Here, every bid is an open book. Thanks to the immutable nature of blockchain, each proposal, decision, and transaction is recorded transparently. This means no more backdoor deals or lost paperwork—just a straightforward, honest process visible to all.
                    &nbsp;<br></br><br></br>
                    But don't mistake our commitment to transparency for simplicity. Behind the scenes, Procurely is driven by robust, cutting-edge technology designed to streamline the procurement process. From identity verification to automated compliance checks, we've thought of everything to make your bidding experience as smooth and secure as possible.
                    &nbsp;<br></br><br></br>
                    We're not here to uphold the status quo. We're here to challenge it, to innovate, and to build a community where trust is built into the system. Whether you're a small business owner looking to expand your horizons or a government entity committed to fair and open procurement, Procurely is your partner in making public contracts more accessible, equitable, and transparent.
                    &nbsp;<br></br><br></br>
                    Join us on this journey. Together, we can pave the way for a new era of public procurement—one bid at a time.</p>
            </div>
            <div className={styles.imageContainer}>
                <Image src="/blockchainimage.png" alt="Image 1" width={500} height={300} />
            </div>
        </div>
    );
}

export default About;