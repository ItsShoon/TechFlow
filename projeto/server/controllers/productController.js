const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');

// Função para ler os produtos do arquivo JSON
const readProductsFromFile = () => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Função para escrever os produtos no arquivo JSON
const writeProductsToFile = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
};

// Obter todos os produtos
exports.getProducts = (req, res) => {
  try {
    const products = readProductsFromFile();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler o arquivo de produtos' });
  }
};

// Obter produtos por categoria
exports.getProductsByCategory = (req, res) => {
  const { category } = req.params;
  try {
    const products = readProductsFromFile();
    const filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler o arquivo de produtos' });
  }
};

// Adicionar novo produto
exports.addProduct = (req, res) => {
  const newProduct = req.body;
  try {
    const products = readProductsFromFile();
    newProduct.id = products.length + 1; // Atribuir um novo ID ao produto
    products.push(newProduct);
    writeProductsToFile(products);
    res.json({ message: 'Produto adicionado com sucesso', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar o produto' });
  }
};

// Atualizar produto existente
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  try {
    let products = readProductsFromFile();
    products = products.map(product => (product.id == id ? { ...product, ...updatedProduct } : product));
    writeProductsToFile(products);
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o produto' });
  }
};