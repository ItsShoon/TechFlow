const fs = require('fs');
const path = require('path');

const campaignsFilePath = path.join(__dirname, '../data/campaigns.json');

const getCampaigns = () => {
    const campaignsData = fs.readFileSync(campaignsFilePath);
    return JSON.parse(campaignsData);
};

const saveCampaigns = (campaigns) => {
    fs.writeFileSync(campaignsFilePath, JSON.stringify(campaigns, null, 2));
};

exports.getAllCampaigns = (req, res) => {
    try {
        const campaigns = getCampaigns();
        res.json(campaigns);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addCampaign = (req, res) => {
    const { title, description, discount } = req.body;
    try {
        const campaigns = getCampaigns();
        const newCampaign = { id: Date.now(), title, description, discount };
        campaigns.push(newCampaign);
        saveCampaigns(campaigns);
        res.json(newCampaign);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateCampaign = (req, res) => {
    const { title, description, discount } = req.body;
    try {
        let campaigns = getCampaigns();
        const campaignIndex = campaigns.findIndex(campaign => campaign.id === parseInt(req.params.id));
        if (campaignIndex === -1) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        campaigns[campaignIndex] = { ...campaigns[campaignIndex], title, description, discount };
        saveCampaigns(campaigns);
        res.json(campaigns[campaignIndex]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteCampaign = (req, res) => {
    try {
        let campaigns = getCampaigns();
        const campaignIndex = campaigns.findIndex(campaign => campaign.id === parseInt(req.params.id));
        if (campaignIndex === -1) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        campaigns.splice(campaignIndex, 1);
        saveCampaigns(campaigns);
        res.json({ msg: 'Campaign removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
