const fs = require('fs');
const path = require('path');

const contactsFilePath = path.join(__dirname, '../data/contactos.json');

// Função para obter todos os contatos
const getContacts = () => {
    const contactsData = fs.readFileSync(contactsFilePath);
    return JSON.parse(contactsData);
};

// Função para salvar os contatos
const saveContacts = (contacts) => {
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));
};

// Controlador para obter todos os contatos
exports.getAllContacts = (req, res) => {
    try {
        const contacts = getContacts();
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Controlador para adicionar um novo contato
exports.addContact = (req, res) => {
    const { name, email, message } = req.body;
    try {
        const contacts = getContacts();
        const newContact = { id: Date.now(), name, email, message };
        contacts.push(newContact);
        saveContacts(contacts);
        res.json(newContact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Controlador para atualizar um contato existente
exports.updateContact = (req, res) => {
    const { name, email, message } = req.body;
    try {
        let contacts = getContacts();
        const contactIndex = contacts.findIndex(contact => contact.id === parseInt(req.params.id));
        if (contactIndex === -1) {
            return res.status(404).json({ msg: 'Contact not found' });
        }

        contacts[contactIndex] = { ...contacts[contactIndex], name, email, message };
        saveContacts(contacts);
        res.json(contacts[contactIndex]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Controlador para excluir um contato
exports.deleteContact = (req, res) => {
    try {
        let contacts = getContacts();
        const contactIndex = contacts.findIndex(contact => contact.id === parseInt(req.params.id));
        if (contactIndex === -1) {
            return res.status(404).json({ msg: 'Contact not found' });
        }

        contacts.splice(contactIndex, 1);
        saveContacts(contacts);
        res.json({ msg: 'Contact removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
