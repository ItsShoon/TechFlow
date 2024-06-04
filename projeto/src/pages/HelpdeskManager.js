import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './HelpdeskManager.css';


Modal.setAppElement('#root');


const HelpdeskManager = () => {
  const [helpdeskRequests, setHelpdeskRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
    const [sortCriteria, setSortCriteria] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    // Fetch helpdesk requests from the API
    const fetchHelpdeskRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/helpdesk');
        if (!response.ok) {
          throw new Error('Erro ao consultar pedidos');
        }
        const data = await response.json();
        setHelpdeskRequests(data);
        console.log(data);
      } catch (error) {
        console.error('Erro ao consultar pedidos:', error);
      }
    };
    fetchHelpdeskRequests();
  }, []);

  const openModal = (request) => {
    setSelectedRequest(request);
    setNotes(request.notes || '');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  

  const handleSave = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT');
  
    const updatedRequest = {
      ...selectedRequest,
      notes,
      status: document.getElementById('status').value,
      lastUpdatedDate: formattedDate // Adiciona a data da última alteração ao objeto atualizado
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/helpdesk/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRequest),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erro ao atualizar pedido: ${errorMessage}`);
      }
      
      // Atualiza a lista de pedidos após a atualização no servidor
      const updatedRequests = helpdeskRequests.map((request) =>
        request.id === selectedRequest.id ? updatedRequest : request
      );
      setHelpdeskRequests(updatedRequests);
  
      closeModal();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  }; 

  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (criteria) => {
    if (sortCriteria === criteria) {
      return sortDirection === 'asc' ? '▲' : '▼';
    } else {
      return '▲▼';
    }
  };
  
  
  return (
    <div className="hdm-manage-container"> 
      <h2>Pedidos de Helpdesk</h2>
      {helpdeskRequests.length > 0 ? (
        <table className="helpdesk-table">
          <thead>
          <tr>
              <th onClick={() => handleSort('id')}>Pedido {getSortIcon('id')}</th>
              <th onClick={() => handleSort('helpdeskType')}>Tipo de Pedido {getSortIcon('helpdeskType')}</th>
              <th onClick={() => handleSort('equipment')}>Equipamento {getSortIcon('equipment')}</th>
              <th onClick={() => handleSort('invoiceNumber')}>Nº Fatura {getSortIcon('invoiceNumber')}</th>
              <th onClick={() => handleSort('description')}>Descrição {getSortIcon('description')}</th>
              <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
              <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
              <th onClick={() => handleSort('currentDate')}>Data do Pedido {getSortIcon('currentDate')}</th>
              <th onClick={() => handleSort('lastUpdatedDate')}>Update {getSortIcon('lastUpdatedDate')}</th>
            </tr>
          </thead>
          <tbody>
            {helpdeskRequests
              .slice()
              .sort((a, b) => {
                if (!sortCriteria) return 0;
                
                const valA = a[sortCriteria] || '';
                const valB = b[sortCriteria] || '';
                
                const dateA = new Date(valA);
                const dateB = new Date(valB);

                // Check if both values are valid dates
                if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                  return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
                }

                // Otherwise, do a localeCompare (for string comparison)
                const comparison = valA.localeCompare(valB);
                return sortDirection === 'desc' ? -comparison : comparison;
              })
              .map((request, index) => (
                <tr key={index} onClick={() => openModal(request)}>
                  <td>{request.id}</td>
                  <td>{request.helpdeskType}</td>
                  <td>{request.equipment}</td>
                  <td>{request.invoiceNumber}</td>
                  <td>{request.description}</td>
                  <td>{request.email}</td>
                  <td>{request.status}</td>
                  <td>{request.currentDate}</td>
                  <td>{request.lastUpdatedDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum pedido de helpdesk encontrado.</p>
      )}

      {selectedRequest && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Detalhes do Pedido"
          className="helpdesk-modal"
          overlayClassName="Overlay"
        >
          <h2>Detalhes do Pedido</h2>
          <div>
            <p>
              <strong>Pedido:</strong> {selectedRequest.id}
            </p>
            <p>
              <strong>Tipo de Pedido:</strong> {selectedRequest.helpdeskType}
            </p>
            <p>
              <strong>Equipamento:</strong> {selectedRequest.equipment}
            </p>
            <p>
              <strong>Nº Fatura:</strong> {selectedRequest.invoiceNumber}
            </p>
            <p>
              <strong>Descrição:</strong> {selectedRequest.description}
            </p>
            <p>
              <strong>Email:</strong> {selectedRequest.email}
            </p>
            <p>
              <strong>Data do pedido:</strong> {selectedRequest.currentDate}
            </p>
            <div className="status-container">
              <label htmlFor="status">Status:</label>
              <select id="status" defaultValue={selectedRequest.status}>
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
            <div className="notes-container">
              <label htmlFor="notes">Notas:</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            <button className="hdmsave-button" onClick={handleSave}>Salvar</button>
            <button className="hdmclose-button" onClick={closeModal}>Fechar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HelpdeskManager;