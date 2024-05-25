const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const loginUser = (req, res) => {
  const { email, password } = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.json({ message: 'Login bem-sucedido', user });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
};

const registerUser = (req, res) => {
  const newUser = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
    }

    const users = JSON.parse(data);
    const userExists = users.some(u => u.email === newUser.email);

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o usuário' });
      }

      res.json({ message: 'Registro bem-sucedido', user: newUser });
    });
  });
};

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

// Controlador para buscar usuário por email
const getUserByEmail = async (req, res) => {
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
    console.error('Erro ao buscar usuário1usc:', error); // Log adicional para depuração
    res.status(500).json({ error: 'Erro ao buscar usuário2usc' });
  }
};

// Controlador para atualizar usuário por email
exports.updateUserByEmail = async (req, res) => {
  const { email } = req.query;
  const updatedData = req.body;



  if (!email) {
    return res.status(400).json({ error: 'Email não fornecido' });
  }

  try {
    const users = await readFile(usersFilePath);
  

    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    users[userIndex] = { ...users[userIndex], ...updatedData };

    await writeFile(usersFilePath, users);
    

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
   
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};


module.exports = { loginUser, registerUser, getUserByEmail };