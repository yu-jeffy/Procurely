const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ProcurelyModule = buildModule("ProcurelyFactoryModule", (m) => {
    // Deploy the Factory Contract
    const ProcurelyFactory = m.contract("ProcurelyFactory");

    // Optionally, demonstrate creating a Procurely instance via the Factory
    // This is an advanced use case, showing how you could automate post-deployment actions within Ignition
    // Note: For actual contract calls or transactions, please perform them in your dApp or scripts, since Ignition primarily focuses on deployment.
    // const initialProcurelyDeployment = ProcurelyFactory.methods.createProcurely().send({ from: m.defaultAccount });

    return { ProcurelyFactory };
});

module.exports = ProcurelyModule;