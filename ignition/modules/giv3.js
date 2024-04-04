const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const Giv3Module = buildModule("Giv3Module", (m) => {
    const campaignFactory = m.contract("CampaignFactory");
    //const campaign = m.contract("Campaign");

    return { campaignFactory }; //, campaign
});

module.exports = Giv3Module;