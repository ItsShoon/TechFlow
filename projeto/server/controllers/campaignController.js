const fs = require('fs');
const path = require('path');

const campaignsFilePath = path.join(__dirname, '../data/campaigns.json');

const readCampaigns = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(campaignsFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const writeCampaigns = (campaigns) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(campaignsFilePath, JSON.stringify(campaigns, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await readCampaigns();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler as campanhas' });
  }
};

const addCampaign = async (req, res) => {
  const newCampaign = req.body;

  try {
    const campaigns = await readCampaigns();
    newCampaign.id = campaigns.length ? campaigns[campaigns.length - 1].id + 1 : 1;
    campaigns.push(newCampaign);
    await writeCampaigns(campaigns);
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar campanha' });
  }
};

const updateCampaign = async (req, res) => {
  const updatedCampaign = req.body; 
  const id = parseInt(req.params.id);

  try {
    let campaigns = await readCampaigns();
    const campaignIndex = campaigns.findIndex((item) => item.id === id);

    if (campaignIndex === -1) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }

    campaigns[campaignIndex] = { ...campaigns[campaignIndex], ...updatedCampaign };
    await writeCampaigns(campaigns);
    res.json(campaigns[campaignIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar campanha' });
  }
};

const deleteCampaign = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    let campaigns = await readCampaigns();
    campaigns = campaigns.filter(campaign => campaign.id !== id);
    await writeCampaigns(campaigns);
    res.json({ message: 'Campanha removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover campanha' });
  }
};

module.exports = { getAllCampaigns, addCampaign, updateCampaign, deleteCampaign };



