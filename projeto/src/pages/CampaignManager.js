import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CampaignManager.css';

const CampaignManager = ({ campaigns = [], onAddCampaign }) => {
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(false);

  const handleAddCampaign = (e) => {
    e.preventDefault();
    const newCampaign = {
      id: campaigns.length + 1,
      name,
      discount: parseFloat(discount),
      startDate,
      endDate,
      active
    };
    onAddCampaign(newCampaign);
    setName('');
    setDiscount('');
    setStartDate('');
    setEndDate('');
    setActive(false);
  };

  return (
    <div className="manage-container">
      <h2>Gerir Campanhas</h2>
      <div className="tab-container">
        <Link to="/gerir-campanhas" className="tab-link active">Adicionar Campanha</Link>
        <Link to="/editar-campanha" className="tab-link">Editar Campanha</Link>
      </div>
      <form className="manage-form" onSubmit={handleAddCampaign}>
        <label>Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Desconto (%):</label>
        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} required />
        <label>Data de Início:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <label>Data de Fim:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <label>
          Ativa:
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        </label>
        <button type="submit">Adicionar Campanha</button>
      </form>
      <h2>Campanhas Existentes</h2>
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Desconto</th>
            <th>Data de Início</th>
            <th>Data de Fim</th>
            <th>Ativa</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{campaign.discount}%</td>
              <td>{campaign.startDate}</td>
              <td>{campaign.endDate}</td>
              <td>{campaign.active ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignManager;
