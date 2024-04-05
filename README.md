# Procurely - *decentralized procurement*
Procurely is a web3 application that aims to transform the way government contracts are discovered, bid on, and awarded. It leverages blockchain technology to ensure transparency, trust, and efficiency in public procurement. The application provides a marketplace for public sector opportunities, making them accessible to businesses of all sizes. It records each proposal, decision, and transaction transparently, eliminating the possibility of backdoor deals or lost paperwork. 

Government entities register and create procurements with tenders. Companies can bid on the tenders and win the contract. All on chain.


## Getting Started

## Compile the Factory and Procurely Contracts
```bash
npx hardhat compile
```

## Deploy the Factory Smart Contract
```bash
npx hardhat ignition deploy ignition/modules/procurely.js --network sepolia
```

Save the deployment address in the terminal. Use this in the .env file.

## Set Up Environment Variables
```bash
FACTORY_ADDRESS="paste it here"
```

## Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Get Sepolia Testnet Funds
```bash
https://sepolia-faucet.pk910.de/#/
```

## Create and Bid
Connect your wallet, go to the create page and start your first procurement and tenders. Go to the contracts page to find procurements and tenders to bid on.

This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).