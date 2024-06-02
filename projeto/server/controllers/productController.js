const fs = require('fs');
const path = require('path');
const multer = require('multer');
const products = require('../data/products.json');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'products'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const getProducts = (req, res) => {
  res.json(products);
};

const getProductsByCategory = (req, res) => {
  const { category } = req.params;
  const filteredProducts = products.filter(product => product.category === category);
  res.json(filteredProducts);
};

const addProduct = (req, res) => {
  const newProduct = {
    ...req.body,
    id: products.length + 1,
    image: req.file ? `/images/products/${req.file.filename}` : null
  };
  products.push(newProduct);

  fs.writeFile(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save product' });
    }
    res.status(201).json(newProduct);
  });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  try {
    const products = await readProductsFromFile();
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    await writeProductsToFile(products);
    res.json(products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(product => product.id === parseInt(id));

  if (index !== -1) {
    products.splice(index, 1);
    fs.writeFile(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete product' });
      }
      res.status(204).end();
    });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
};

module.exports = {
  getProducts,
  getProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  upload
};