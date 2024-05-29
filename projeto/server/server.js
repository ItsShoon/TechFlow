const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const productsFilePath = path.join(__dirname, 'data', 'products.json');

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

// Rotas de autenticação
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await readFile(usersFilePath);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.json({ message: 'Login bem-sucedido', user });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
  }
});

app.post('/register', async (req, res) => {
  const newUser = req.body;

  try {
    const users = await readFile(usersFilePath);
    const userExists = users.some(u => u.email === newUser.email);

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    users.push(newUser);

    await writeFile(usersFilePath, users);
    res.json({ message: 'Registro bem-sucedido', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar o usuário' });
  }
});

// Rotas de produtos
app.get('/api/products', async (req, res) => {
  try {
    const products = await readFile(productsFilePath);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler produtos' });
  }
});

app.get('/api/products/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const products = await readFile(productsFilePath);
    const filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler produtos' });
  }
});

app.post('/api/products', async (req, res) => {
  const newProduct = req.body;
  try {
    const products = await readFile(productsFilePath);
    newProduct.id = products.length + 1;
    products.push(newProduct);
    await writeFile(productsFilePath, products);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar produto' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  try {
    let products = await readFile(productsFilePath);
    products = products.map(product => (product.id == id ? { ...product, ...updatedProduct } : product));
    await writeFile(productsFilePath, products);
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let products = await readFile(productsFilePath);
    products = products.filter(product => product.id != id);
    await writeFile(productsFilePath, products);
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

app.post('/api/helpdesk', (req, res) => {
  const helpdeskData = req.body;

  // Lê o arquivo JSON existente
  fs.readFile(path.join(__dirname, 'data', 'helpdesk.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o arquivo de pedidos' });
    }

    // Converte o conteúdo do arquivo JSON em um array de objetos
    let helpdesk = [];
    if (data) {
      helpdesk = JSON.parse(data);
    }

    // Adiciona os novos dados do helpdesk ao array
    helpdesk.push(helpdeskData);

    // Escreve o array atualizado de volta no arquivo JSON
    fs.writeFile(path.join(__dirname, 'data', 'helpdesk.json'), JSON.stringify(helpdesk, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o pedido' });
      }

      res.status(201).json({
        id: helpdeskData.id, // Número do pedido recebido do frontend
      });
    });
  });
});


// Endpoint para obter todos os pedidos de helpdesk
app.get('/api/helpdesk', (req, res) => {
  const { email } = req.query; // Obtém o parâmetro de email da consulta

  // Lê o arquivo JSON e envia os dados como resposta
  fs.readFile(path.join(__dirname, 'data', 'helpdesk.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o arquivo de pedidos' });
    }

    const helpdesk = JSON.parse(data);

    if (email) {
      // Filtra os pedidos pelo email se o parâmetro email estiver presente
      const filteredHelpdesk = helpdesk.filter(request => request.email === email);
      return res.json(filteredHelpdesk);
    }

    // Se não houver parâmetro email, retorna todos os pedidos
    res.json(helpdesk);
  });
});


app.put('/api/helpdesk/:id', (req, res) => {
  const requestId = req.params.id; // Obtém o ID do pedido a ser atualizado
  const updatedData = req.body; // Obtém os dados atualizados do corpo da solicitação

  // Lê o arquivo JSON existente
  fs.readFile(path.join(__dirname, 'data', 'helpdesk.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o arquivo de pedidos' });
    }

    let helpdesk = [];
    if (data) {
      helpdesk = JSON.parse(data);
    }

    // Procura o pedido com o ID correspondente na lista de pedidos
    const index = helpdesk.findIndex((item) => item.id === requestId);

    // Se o pedido não for encontrado, retorna um erro 404
    if (index === -1) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Atualiza os dados do pedido na lista
    helpdesk[index] = { ...helpdesk[index], ...updatedData };

    // Escreve o array atualizado de volta no arquivo JSON
    fs.writeFile(path.join(__dirname, 'data', 'helpdesk.json'), JSON.stringify(helpdesk, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar o pedido' });
      }

      res.json({ message: 'Pedido atualizado com sucesso' });
    });
  });
});


app.get('/api/users', async (req, res) => {
  const { email } = req.query;

  console.log('Email recebido para busca:', email); // Log adicional

  if (!email) {
    return res.status(400).json({ error: 'Email não fornecido' });
  }

  try {
    const users = await readFile(usersFilePath);
    console.log('Usuários lidos:', users); // Log adicional

    const user = users.find(u => u.email === email);
    console.log('Usuário encontrado:', user); // Log adicional

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error); // Log adicional para depuração
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});


// Rota para atualizar usuário por email
app.put('/api/users', async (req, res) => {
  const { email } = req.query;
  const updatedData = req.body;

  console.log('Email recebido para atualização:', email); // Log adicional
  console.log('Dados recebidos para atualização:', updatedData); // Log adicional

  if (!email) {
    return res.status(400).json({ error: 'Email não fornecido' });
  }

  try {
    const users = await readFile(usersFilePath);
    console.log('Usuários lidos:', users); // Log adicional

    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    users[userIndex] = { ...users[userIndex], ...updatedData };

    await writeFile(usersFilePath, users);
    console.log('Usuário atualizado com sucesso:', users[userIndex]); // Log adicional

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error); // Log adicional para depuração
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});
       
// Importar e usar as rotas de campanhas
const campaignRoutes = require('./routes/campaigns');
app.use('/api/campaigns', campaignRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});