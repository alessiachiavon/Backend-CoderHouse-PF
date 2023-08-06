const express = require('express');
const router = express.Router();
const fs = require('fs');

// Leer productos desde el archivo JSON
const productsData = fs.readFileSync('carrito.json', 'utf-8');
const carts = JSON.parse(productsData);

// Ruta para crear un carrito
router.post('/api/carts', (req, res) => {

    const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
    const newCartId = maxId + 1;
    const newCart = req.body;
    newCart.id = newCartId
    newCart.products = []
    carts.push(newCart);
    fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 4));

    res.json({ message: 'Carrito creado correctamente.' });

});

router.get('/api/carts/:cid', (req, res) => {
    const cid = parseInt(req.params.cid)
    console.log(cid)


    // Ejemplo de búsqueda en un array de productos
    const cart = carts.find((cart) => cart.id === cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    return res.json(cart);
})

// Agregar un producto por su ID (PUT /:cid/product/:pid)
router.post('/api/carts/:cid/products/:pid', (req, res) => {
    const cid = parseInt(req.params.cid); // Obtener el ID del carrito
    const pid = parseInt(req.params.pid); // Obtener el ID del producto a agregar

    // Buscar el carrito en el array de carritos por su ID
    const cart = carts.find((cart) => cart.id === cid);

    // Verificar si el carrito existe
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    //Corroborar si ya existe ese ID en el carrito
    
    const isProductIndex = cart.products.findIndex((product) => product.id === pid);

    if (isProductIndex === -1) {
        // Si el producto no existe en el carrito, agregarlo con cantidad 1
        cart.products.push({ id: pid, quantity: 1 });
    } else {
        // Si el producto ya existe en el carrito, aumentar la cantidad
        cart.products[isProductIndex].quantity++;
    }
   
    // Guardar la información actualizada en el archivo JSON
    fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 4));

    res.json({ message: 'Producto agregado al carrito correctamente.' });
});



module.exports = router;