// Importa la herramienta 'path' de Node.js para trabajar con rutas de archivos y carpetas
const path = require ('node:path');

// Importa la herramienta 'fs' para leer y escribir archivos en el disco
const fs = require('fs');

// Importa la lista de productos desde el archivo producto.json
const data = require('../models/producto.json');

const dataa = require('../models/servicio.json');

// Crea un objeto llamado 'controller' que guarda las funciones para responder a las rutas
const controller = {
    // Función que se usa cuando alguien entra a la página principal
    index: (req, res) => {
        // Muestra la página principal y le pasa la lista de productos para mostrar en la web
        res.render('index', {
            data: data,
            dataa: dataa
        });
    },

    // Función que se usa cuando alguien entra al formulario de contacto
    form: (req, res) => {
        // Muestra la página del formulario de contacto
        res.render('form');
    },

    // Función que se usa cuando alguien envía el formulario de contacto
    processForm: (req, res) => {
        // Toma los datos enviados por el usuario desde el formulario
        const { nombre, email, mensaje } = req.body;

        console.log('Datos recibididos del formulario:', { nombre, email, mensaje });

        // Prepara un array para guardar los mensajes
        let mensajes = [];

        // Define la ruta donde se guardarán los mensajes en mensajes.json
        const mensajesPath = path.join(__dirname, '../models/mensajes.json');

        // Si el archivo mensajes.json existe, lo lee y carga los mensajes anteriores
        if (fs.existsSync(mensajesPath)) {
            mensajes = JSON.parse(fs.readFileSync(mensajesPath, 'utf-8'));
        }

        // Agrega el nuevo mensaje al array, junto con la fecha actual
        mensajes.push({ nombre, email, mensaje, fecha: new Date().toISOString() });

        // Escribe el array actualizado en el archivo mensajes.json
        fs.writeFileSync(mensajesPath, JSON.stringify(mensajes, null, 2));

        // Muestra un mensaje de agradecimiento al usuario en la web
        res.send(`<h1>Gracias, ${nombre}.</h1><p>Tu formulario se ha enviado correctamente.</p>`);
    },

    ventas: (req, res) => {
        res.render('ventas');
    },
    
    productoDetalle: (req, res) => {
        const id = parseInt(req.params.id);
        const producto = data.find(p => p.id === id);
        if (producto) {
            res.render('producto', { producto });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    },

    servicioDetalle: (req, res) => {
        const id = parseInt(req.params.id);
        const servicio = dataa.find(s => s.id === id);
        if (servicio) {
            res.render('servicio', { servicio });
        } else {
            res.status(404).send('Servicio no encontrado');
        }
    },

    // Muestra todos los productos y servicios
    prodserv: (req, res) => {
        res.render('prod&serv', {
            data: data,
            dataa: dataa
        });
    },

    agregarItem: (req, res) => {
        try {
            // Toma los datos enviados desde el formulario
            const { tipo, nombre, precio } = req.body;
            const imgFile = req.file; // Multer guarda la imagen en req.file

            // Guarda solo el nombre del archivo de imagen
            const imgPath = imgFile.filename;

            // Define el archivo JSON donde se guardará el nuevo producto o servicio
            let filePath;
            if (tipo === 'producto') {
                filePath = path.join(__dirname, '../models/producto.json');
            } else if (tipo === 'servicio') {
                filePath = path.join(__dirname, '../models/servicio.json');
            } else {
                return res.status(400).send('Tipo inválido');
            }

            // Lee los productos/servicios existentes del archivo JSON
            let items = [];
            if (fs.existsSync(filePath)) {
                items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }

            // Genera un nuevo id para el producto/servicio
            let newId = 1;
            if (items.length > 0) {
                newId = Math.max(...items.map(i => i.id)) + 1;
            }

            // Agrega el nuevo producto/servicio al array
            items.push({ id: newId, nombre, precio, img: imgPath });

            // Guarda el array actualizado en el archivo JSON
            fs.writeFileSync(filePath, JSON.stringify(items, null, 2));

            // Responde al usuario confirmando que se agregó correctamente
            res.send(`<h1>Tu ${tipo} ha sido agregado correctamente</h1>`);
        } catch (error) {
            // Si ocurre un error, lo muestra en la consola y responde con un mensaje de error
            console.error('Error al agregar item:', error);
            res.status(500).send('Ocurrió un error al guardar el item.');
        }
    }
}

// Exporta el objeto 'controller' para que pueda ser usado en otros archivos del proyecto
module.exports = controller;