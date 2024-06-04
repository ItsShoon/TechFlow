import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditCampaign.css';

const EditCampaign = ({ campaigns, onUpdateCampaign }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    const campaignToEdit = campaigns.find(c => c.id === parseInt(id));
    if (campaignToEdit) {
      setCampaign(campaignToEdit);
      setName(campaignToEdit.name);
      setDiscount(campaignToEdit.discount);
      setStartDate(campaignToEdit.startDate);
      setEndDate(campaignToEdit.endDate);
      setActive(campaignToEdit.active);
    }
  }, [id, campaigns]);

  const handleUpdateCampaign = (e) => {
    e.preventDefault();
    const updatedCampaign = {
      ...campaign,
      name,
      discount,
      startDate,
      endDate,
      active
    };
    onUpdateCampaign(updatedCampaign);
    navigate('/gerir-campanhas');
  };

  return (
    <div className="edit-campaign-container">
      <h2>Editar Campanha</h2>
      <form className="edit-campaign-form" onSubmit={handleUpdateCampaign}>
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
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="checkbox-active" />
        </label>
        
        <button type="submit" className="btn-submit-edit-campaign">Atualizar Campanha</button>
      </form>
    </div>
  );
};

export default EditCampaign;