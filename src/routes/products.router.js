const express = require('express');
const router = express.Router();
const fs = require('fs');

// Leer productos desde el archivo JSON
const productsData = fs.readFileSync('products.json', 'utf-8');
const products = JSON.parse(productsData);

router.get('/api/products', (req, res) => {
    const { limit } = req.query;

    // Si no se proporciona un valor para limit, obtener todos los productos
    const productList = limit ? products.slice(0, parseInt(limit)) : products;

    res.json({ products: productList });
})

router.get('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid)
    console.log(pid)


    // Ejemplo de búsqueda en un array de productos
    const product = products.find((product) => product.id === pid);

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    return res.json(product);
})

// Ruta para agregar un nuevo producto
router.post('/api/products', (req, res) => {

    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    const newProductId = maxId + 1;
    const newProduct = req.body;
    const productPrice = newProduct.productPrice
    const productStock = newProduct.productStock
    newProduct.productPrice = parseFloat(productPrice)
    newProduct.productStock = parseFloat(productStock)
    newProduct.id = newProductId
    newProduct.status = true
    console.log(newProduct)
    products.push(newProduct);
    fs.writeFileSync('products.json', JSON.stringify(products, null, 4));

    res.json({ message: 'Producto agregado correctamente.' });

});

function generateUniqueId() {
    return Date.now().toString();
}

// Ruta para actualizar un producto por su ID (PUT /:pid)
router.put('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const updateFields = req.body;

    // Validamos que se proporcionen campos para actualizar
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar.' });
    }

    const productIndex = products.findIndex((product) => product.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    products[productIndex] = {
        ...products[productIndex],
        ...updateFields
    };

    fs.writeFileSync('products.json', JSON.stringify(products, null, 4));

    return res.json(products[productIndex]);
});

// Ruta para eliminar un producto por su ID (DELETE /:pid)
router.delete('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);


    const productIndex = products.findIndex((product) => product.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const deletedProduct = products.splice(productIndex, 1);

    fs.writeFileSync('products.json', JSON.stringify(products, null, 4));

    return res.json(deletedProduct[0]);
});


module.exports = router;