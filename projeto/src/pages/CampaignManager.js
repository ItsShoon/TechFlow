import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CampaignManager.css';

const CampaignManager = ({ campaigns, onAddCampaign, onDeleteCampaign }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    discount: '',
    startDate: '',
    endDate: '',
    active: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCampaign(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCampaign = () => {
    onAddCampaign(newCampaign);
    setNewCampaign({ name: '', discount: '', startDate: '', endDate: '', active: false });
    setIsAdding(false);
  };

  return (
    <div className="campaign-container">
      <h2>Gerir Campanhas</h2>
      {isAdding ? (
        <div className="campaign-form">
          <label>Nome:</label>
          <input type="text" name="name" value={newCampaign.name} onChange={handleInputChange} required />
          
          <label>Desconto (%):</label>
          <input type="number" name="discount" value={newCampaign.discount} onChange={handleInputChange} required />
          
          <label>Data de Início:</label>
          <input type="date" name="startDate" value={newCampaign.startDate} onChange={handleInputChange} required />
          
          <label>Data de Fim:</label>
          <input type="date" name="endDate" value={newCampaign.endDate} onChange={handleInputChange} required />
          
          <label>
            Ativa:
            <input type="checkbox" name="active" checked={newCampaign.active} onChange={handleInputChange} className="checkbox-active" />
          </label>
          
          <button onClick={handleAddCampaign} className="btn-submit-campaign">Adicionar Campanha</button>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className="btn-add-campaign">Adicionar Campanha</button>
      )}
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Desconto</th>
            <th>Data de Início</th>
            <th>Data de Fim</th>
            <th>Ativa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(campaign => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{campaign.discount}%</td>
              <td>{campaign.startDate}</td>
              <td>{campaign.endDate}</td>
              <td>{campaign.active ? 'Sim' : 'Não'}</td>
              <td>
                <Link to={`/editar-campanha/${campaign.id}`}>
                  <button className="btn-edit-campaign">Editar</button>
                </Link>
                <button className="btn-delete-campaign" onClick={() => onDeleteCampaign(campaign.id)}>Remover</button>
                <Link to={`/gerir-produtos-campanha/${campaign.id}`}>
                  <button className="btn-manage-campaign-products">Gerir Produtos</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignManager;