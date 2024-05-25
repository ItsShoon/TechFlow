import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserHelpdesk.css';

const UserHelpdesk = () => {
  const { user } = useAuth();
  const [helpdeskRequests, setHelpdeskRequests] = useState([]);

  useEffect(() => {
    const fetchHelpdeskRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/helpdesk?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Erro ao consultar pedidos');
        }
        const data = await response.json();
        setHelpdeskRequests(data);
      } catch (error) {
        console.error('Erro ao consultar pedidos:', error);
      }
    };

    if (user?.email) {
      fetchHelpdeskRequests();
    }
  }, [user]);

  return (
    <div className="user-helpdesk-container">
      <h2>Meus Pedidos de Helpdesk</h2>
      {helpdeskRequests.length > 0 ? (
        <table className="helpdesk-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Tipo de Pedido</th>
              <th>Equipamento</th>
              <th>Nº Fatura</th>
              <th>Descrição</th>
              <th>Email</th>
              <th>Status</th>
              <th>Data do Pedido</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {helpdeskRequests.map((request, index) => (
              <tr key={index}>
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
    </div>
  );
};

export default UserHelpdesk;