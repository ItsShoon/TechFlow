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

module.exports = { loginUser, registerUser };