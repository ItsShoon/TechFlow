const fs = require('fs');
const path = require('path');

const helpdeskFilePath = path.join(__dirname, '../data/helpdesk.json');

const gethelpdesk = (req, res) => {
  fs.readFile(helpdeskFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler os pedidos de helpdesk' });
    }
    const helpdesk = JSON.parse(data);
    res.json(helpdesk);
  });
};

const addHelpdesk = (req, res) => {
  const newHelpdesk = req.body;

  fs.readFile(helpdeskFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler os pedidos de helpdesk' });
    }

    const helpdesk = JSON.parse(data);
    helpdesk.push(newHelpdesk);

    fs.writeFile(helpdeskFilePath, JSON.stringify(helpdesk, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o pedido de helpdesk' });
      }
      res.status(201).json(newHelpdesk);
    });
  });
};

const updateHelpdesk = (req, res) => {
  const updatedHelpdesk = req.body; // Novos dados do pedido fornecidos na requisição
  const id = req.params.id; // Extrai o ID do pedido dos parâmetros da requisição

  console.log('ID do pedido recebido:', helpdeskId);

  fs.readFile(helpdeskFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler os pedidos de helpdesk' });
    }

    let helpdesk = JSON.parse(data);
    const helpdeskIndex = helpdesk.findIndex((item) => item.id === id); // Encontra o índice do pedido que está sendo atualizado

    if (helpdeskIndex === -1) {
      return res.status(404).json({ error: 'Pedido não encontrado' }); // Se o pedido não for encontrado, retorna um erro 404
    }

    // Atualiza os detalhes do pedido com base nos novos dados fornecidos na requisição
    helpdesk[helpdeskIndex] = { ...helpdesk[helpdeskIndex], ...updatedHelpdesk };

    fs.writeFile(helpdeskFilePath, JSON.stringify(helpdesk, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o pedido de helpdesk' });
      }
      res.json(helpdesk[helpdeskIndex]); // Retorna os dados atualizados do pedido
    });
  });
};

module.exports = { gethelpdesk, addHelpdesk, updateHelpdesk };