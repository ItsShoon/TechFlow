const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'server', 'data', 'users.json');
const productsFilePath = path.join(__dirname, 'server', 'data', 'products.json');
const contactsFilePath = path.join(__dirname, 'server', 'data', 'contactos.json');
const helpdeskFilePath = path.join(__dirname, 'server', 'data', 'helpdesk.json');

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

// Rota para salvar contatos
app.post('/api/contact', async (req, res) => {
  const contactData = req.body;
  console.log('Recebido novo contato:', contactData); // Log do contato recebido

  try {
    let contacts = [];
    try {
      contacts = await readFile(contactsFilePath);
    } catch (err) {
      // Se o arquivo não existir, inicializamos como um array vazio
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    contacts.push(contactData);
    await writeFile(contactsFilePath, contacts);
    console.log('Contato salvo com sucesso:', contacts); // Log dos contatos após salvar
    res.status(201).json({ message: 'Contato salvo com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar o contato:', error);
    res.status(500).json({ error: 'Erro ao salvar o contato' });
  }
});

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

// Rotas de helpdesk
app.post('/api/helpdesk', async (req, res) => {
  const helpdeskData = req.body;

  try {
    let helpdesk = [];
    try {
      helpdesk = await readFile(helpdeskFilePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    helpdesk.push(helpdeskData);
    await writeFile(helpdeskFilePath, helpdesk);
    res.status(201).json({ id: helpdeskData.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar o pedido' });
  }
});

app.get('/api/helpdesk', async (req, res) => {
  const { email } = req.query;

  try {
    const helpdesk = await readFile(helpdeskFilePath);

    if (email) {
      const filteredHelpdesk = helpdesk.filter(request => request.email === email);
      return res.json(filteredHelpdesk);
    }

    res.json(helpdesk);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler o arquivo de pedidos' });
  }
});

app.put('/api/helpdesk/:id', async (req, res) => {
  const requestId = req.params.id;
  const updatedData = req.body;

  try {
    let helpdesk = await readFile(helpdeskFilePath);
    const index = helpdesk.findIndex((item) => item.id === requestId);

    if (index === -1) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    helpdesk[index] = { ...helpdesk[index], ...updatedData };
    await writeFile(helpdeskFilePath, helpdesk);
    res.json({ message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o pedido' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
