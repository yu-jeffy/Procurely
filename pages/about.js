import React from 'react';
import Image from 'next/image';
import styles from '../styles/About.module.css';

const About = () => {

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>About</h1>
            <div className={styles.textContainer}>
                <p>This is the about page</p>
                <p>More information about us...</p>
                <p>our platform helps the unbanked, disaster zones, anonymous donations, war relief efforts, and other populations, in addition to general fundraising for anyone</p>
            </div>
            <div className={styles.imageContainer}>
                <Image src="/path/to/image1.jpg" alt="Image 1" width={500} height={300} />
                <Image src="/path/to/image2.jpg" alt="Image 2" width={500} height={300} />
            </div>
        </div>
    );
}

export default About;