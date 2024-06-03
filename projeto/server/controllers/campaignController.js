const fs = require('fs');
const path = require('path');

const campaignsFilePath = path.join(__dirname, '../data/campaigns.json');

// Função para ler arquivos JSON
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Função para escrever arquivos JSON
const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Obtém todas as campanhas
const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await readFile(campaignsFilePath);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler campanhas' });
  }
};

// Adiciona uma nova campanha
const addCampaign = async (req, res) => {
  const newCampaign = req.body;
  try {
    const campaigns = await readFile(campaignsFilePath);
    newCampaign.id = campaigns.length + 1;
    campaigns.push(newCampaign);
    await writeFile(campaignsFilePath, campaigns);
    res.json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar campanha' });
  }
};

// Atualiza uma campanha existente por ID
const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const updatedCampaign = req.body;
  try {
    let campaigns = await readFile(campaignsFilePath);
    campaigns = campaigns.map(campaign => (campaign.id == id ? { ...campaign, ...updatedCampaign } : campaign));
    await writeFile(campaignsFilePath, campaigns);
    res.json({ message: 'Campanha atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar campanha' });
  }
};

// Deleta uma campanha por ID
const deleteCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    let campaigns = await readFile(campaignsFilePath);
    campaigns = campaigns.filter(campaign => campaign.id != id);
    await writeFile(campaignsFilePath, campaigns);
    res.json({ message: 'Campanha removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover campanha' });
  }
};

module.exports = {
  getAllCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
};




