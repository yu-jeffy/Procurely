This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).

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
factoryAddress="paste it here"
```

## Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
