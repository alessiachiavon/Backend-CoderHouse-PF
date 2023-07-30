const fs = require('fs')
const express = require('express')
const app = express()

const PORT = 8080

class Contenedor {
    constructor(file){
      this.file = file
    }
  
    async save(obj){
      try{
        const objects = await this.getAllObjets()
        const lastId = objects.length > 0 ? objects[objects.length -1].id : 0
        const newId = lastId + 1
        const newObj = {id: newId, ...obj}
        objects.push(newObj)
        await this.saveObjects(objects)
        return newId
  
      }catch(error){
        throw new Error('Error al guardar el objeto')
      }
    }
  
    async getAll(){
      try{
        const objects = await this.getAllObjets()
        return objects
  
      }catch(error){
        throw new Error('Error al obtener los objetos')
      }
    }
  
    async getAllObjets(){
      try{
        const data = await fs.promises.readFile(this.file, 'utf-8')
        return data ? JSON.parse(data) : []
      }catch(error){
        return []
      }
    }
  
    async getRandomObjetc() {
        try {
          const objects = await this.getAllObjets();
          const randomIndex = Math.floor(Math.random() * objects.length);
          return objects[randomIndex] || null;
        } catch (error) {
          throw new Error('Error al obtener un producto aleatorio');
        }
      }
  }

app.get('/productos', async (req, res) => {
    try {
        const productos = new Contenedor('productos.txt')
        const listaDeProductos = await productos.getAll()
        res.json(listaDeProductos)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' })
    }
})

app.get('/productoRandom', async (req, res) => {
    try {
      const productos = new Contenedor('productos.txt');
      const productoRandom = await productos.getRandomObjetc();
      if (productoRandom) {
        res.json(productoRandom);
      } else {
        res.status(404).json({ error: 'No hay productos disponibles' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto aleatorio' });
    }
  })

const server = app.listen(PORT, () => {
}) 

server.on("error", error => console.log(`Error en servidor ${error}`))

 