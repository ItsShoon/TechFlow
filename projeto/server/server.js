const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const productsFilePath = path.join(__dirname, 'data', 'products.json');
const campaignsFilePath = path.join(__dirname, 'data', 'campaigns.json');
const campaignProductsFilePath = path.join(__dirname, 'data', 'campaignProducts.json');
const cartFilePath = path.join(__dirname, 'data', 'cart.json');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/products');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

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

// Rota para adicionar um novo produto com upload de imagem
app.post('/api/products', upload.single('image'), async (req, res) => {
  const newProduct = req.body;
  if (req.file) {
    newProduct.image = `/images/products/${req.file.filename}`;
  }
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
    console.error('Erro ao buscar usuário:', error); // Log adicional
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});


// Rota para atualizar utilizador por email
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
    console.error('Erro ao atualizar usuário:', error); // Log adicional
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Rotas de campanhas
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await readFile(campaignsFilePath);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler campanhas' });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const campaigns = await readFile(campaignsFilePath);
    const campaign = campaigns.find(c => c.id === parseInt(id));
    if (campaign) {
      res.json(campaign);
    } else {
      res.status(404).json({ error: 'Campanha não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler campanhas' });
  }
});

app.post('/api/campaigns', async (req, res) => {
  const newCampaign = req.body;
  try {
    const campaigns = await readFile(campaignsFilePath);
    newCampaign.id = campaigns.length + 1;
    campaigns.push(newCampaign);
    await writeFile(campaignsFilePath, campaigns);
    res.json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar campanha' });
  }
});

app.put('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  const updatedCampaign = req.body;
  try {
    let campaigns = await readFile(campaignsFilePath);
    campaigns = campaigns.map(campaign => (campaign.id == id ? { ...campaign, ...updatedCampaign } : campaign));
    await writeFile(campaignsFilePath, campaigns);
    res.json({ message: 'Campanha atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar campanha' });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let campaigns = await readFile(campaignsFilePath);
    campaigns = campaigns.filter(campaign => campaign.id != id);
    await writeFile(campaignsFilePath, campaigns);
    res.json({ message: 'Campanha removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover campanha' });
  }
});

// Função para ler associações de campanhas e produtos
const readCampaignProductsFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(campaignProductsFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Função para escrever associações de campanhas e produtos
const writeCampaignProductsFile = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(campaignProductsFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Endpoint para obter todas as associações de campanhas e produtos
app.get('/api/campaign-products', async (req, res) => {
  try {
    const campaignProducts = await readCampaignProductsFile();
    res.json(campaignProducts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler as associações de campanhas e produtos' });
  }
});

// Endpoint para obter os produtos de uma campanha
app.get('/api/campaign-products/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  try {
    const campaignProducts = await readFile(campaignProductsFilePath);
    const products = await readFile(productsFilePath);
    const productsInCampaign = campaignProducts
      .filter(cp => cp.campaignId === parseInt(campaignId))
      .map(cp => products.find(p => p.id === cp.productId));
    res.json(productsInCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler os produtos da campanha' });
  }
});

// Endpoint para adicionar um produto a uma campanha
app.post('/api/campaign-products/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  const { productId } = req.body;
  try {
    const campaignProducts = await readFile(campaignProductsFilePath);
    campaignProducts.push({ campaignId: parseInt(campaignId), productId: parseInt(productId) });
    await writeFile(campaignProductsFilePath, campaignProducts);
    res.status(201).json({ message: 'Produto adicionado à campanha com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar produto à campanha' });
  }
});

// Endpoint para remover um produto de uma campanha
app.delete('/api/campaign-products/:campaignId/:productId', async (req, res) => {
  const { campaignId, productId } = req.params;
  try {
    let campaignProducts = await readFile(campaignProductsFilePath);
    campaignProducts = campaignProducts.filter(cp => !(cp.campaignId === parseInt(campaignId) && cp.productId === parseInt(productId)));
    await writeFile(campaignProductsFilePath, campaignProducts);
    res.status(200).json({ message: 'Produto removido da campanha com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto da campanha' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});