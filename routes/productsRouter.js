const { Router } = require('express')
const Contenedor = require('../contenedor')

const productos = new Contenedor('products.json')

const router = Router();

router.get('/api/productos', (req, res)=>{
    res.send(productos.data)
})

router.get('/api/productos/:id', async (req, res)=>{
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
        return res.status(400).send({ error: 'El parámetro debe ser un número' });
    }

    if (idNumber > productos.data.length) {
        return res.status(400).send({ error: 'Parámetro fuera de rango' });
    }

    if (idNumber < 0) {
        return res.status(400).send({ error: 'El parámetro debe ser mayor a cero' });
    }

    const product = await productos.getById(idNumber);

    if (!product) {
        return res.status(400).send({ error: 'Producto no encontrado' });
    }

    return res.send(product)
})

router.post('/api/productos', async (req, res)=>{
    const { name, price } = req.body;

    if (!name || !price ) {
        return res.status(400).send({ error: 'Los datos están incompletos' });
    }

    await productos.save({ name, price });
    await productos.init();

    return res.send({ message: 'Producto agregado!'})
})

router.put('/api/productos/:id', async (req, res)=>{
    try {
        const { id } = req.params;
        const { field, value } = req.body;
    
        await productos.editById(Number(id), field, value);
    
        res.send({ message: `El producto ${id} se modificó exitosamente`})
    } catch (error) {
        throw error
    }

})

module.exports = router;