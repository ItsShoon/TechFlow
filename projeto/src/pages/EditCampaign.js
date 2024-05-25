import React, { useState, useEffect } from 'react';
import './CampaignManager.css';
import { useParams } from 'react-router-dom';

const EditCampaign = ({ campaigns, onEditCampaign }) => {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === parseInt(id));

  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setDiscount(campaign.discount);
      setStartDate(campaign.startDate);
      setEndDate(campaign.endDate);
      setActive(campaign.active);
    }
  }, [campaign]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCampaign = {
      ...campaign,
      name,
      discount: parseFloat(discount),
      startDate,
      endDate,
      active
    };
    onEditCampaign(updatedCampaign);
  };

  if (!campaign) return <div>Campanha não encontrada</div>;

  return (
    <div className="manage-container">
      <h2>Editar Campanha</h2>
      <form className="manage-form" onSubmit={handleSubmit}>
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
        <button type="submit">Atualizar Campanha</button>
      </form>
    </div>
  );
};

export default EditCampaign;
