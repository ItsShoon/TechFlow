import React, { useState, useEffect } from 'react';
import './CampaignManager.css';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/campaigns')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched campaigns:', data);
        setCampaigns(data);
      })
      .catch(error => console.error('Error fetching campaigns:', error));
  }, []);

  const handleAddCampaign = (e) => {
    e.preventDefault();
    const newCampaign = {
      name,
      discount: parseFloat(discount),
      startDate,
      endDate,
      isActive,
    };

    console.log('Sending new campaign to server:', newCampaign);

    fetch('http://localhost:5000/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCampaign),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(savedCampaign => {
        console.log('Campaign added:', savedCampaign);
        setCampaigns([...campaigns, savedCampaign]);
        setName('');
        setDiscount('');
        setStartDate('');
        setEndDate('');
        setIsActive(false);
        setShowForm(false); // Hide form after adding
      })
      .catch(error => console.error('Error adding campaign:', error));
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="manage-container">
      <button className="btn-add-campaign" onClick={toggleFormVisibility}>
        {showForm ? 'Fechar Formulário' : 'Adicionar Campanha'}
      </button>
      {showForm && (
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
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="checkbox-active" />
          </label>
          <button type="submit" className="btn-submit-campaign-2">Adicionar Campanha</button>
        </form>
      )}
      <h3>Campanhas Existentes</h3>
      {campaigns.length > 0 ? (
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
                <td>{campaign.isActive ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma campanha encontrada.</p>
      )}
    </div>
  );
};

export default CampaignManager;








