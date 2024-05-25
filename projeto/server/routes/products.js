const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);

module.exports = router;