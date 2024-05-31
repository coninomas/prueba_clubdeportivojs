const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const filePath = path.join(__dirname, "deportes.json");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//Funciones para leer y escribir JSON
const readFile = () => {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

const writeFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

//Ruta para agregar un deporte
app.post("/agregar", (req, res) => {
    const { nombre, precio } = req.body;
    const deportes = readFile();
    if (!nombre || !precio) {
      return res.status(400).json({ error: "Ingrese nombre y precio" });
    }
    deportes.push({ nombre, precio });
    writeFile(deportes);
    res.json({ message: "Deporte agregado con éxito" });
});

//Ruta para editar un deporte
app.post("/editar", (req, res) => {
    const { nombre, precio } = req.body;
    const deportes = readFile();

    const deporte = deportes.find((d) => d.nombre === nombre);
    if (!deporte) {
      return res.status(404).json({ error: "Deporte no encontrado" });
    }
    deporte.precio = precio;
    writeFile(deportes);
    res.json({ message: "Deporte editado con éxito" });
});

//Ruta para eliminar un deporte
app.post("/eliminar", (req, res) => {
    const { nombre } = req.body;
    let deportes = readFile();
    deportes = deportes.filter((d) => d.nombre !== nombre);
    writeFile(deportes);
    res.json({ message: "Deporte eliminado" });
});

//Ruta para ver todos los deportes
app.get("/deportes", (req, res) => {
    const deportes = readFile();
    res.json({ deportes });
});

//Servidor 
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
