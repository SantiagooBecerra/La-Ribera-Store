// Importa express para crear rutas
const express = require('express');

// Crea el router para definir las rutas de la web
const router = express.Router();

// Importa el controlador principal con las funciones para cada ruta
const mainController = require('../controller/mainController');

// Importa multer para manejar la subida de archivos (imágenes)
const multer = require('multer');
const path = require('node:path');

// Configura multer para guardar imágenes en la carpeta /public/images
const storage = multer.diskStorage({
    // Define la carpeta donde se guardan las imágenes subidas
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images'));
    },
    // Define el nombre del archivo guardado (fecha + nombre original)
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
// Crea el middleware de multer con la configuración anterior
const upload = multer({ storage: storage });

// Rutas principales de la web
router.get('/', mainController.index); // Página principal
router.get('/prod&serv', mainController.prodserv); // Productos y servicios
router.get('/contacto', mainController.form); // Formulario de contacto
router.post('/form', mainController.processForm); // Procesa el formulario de contacto
router.get('/producto/:id', mainController.productoDetalle); // Detalle de producto
router.get('/servicio/:id', mainController.servicioDetalle); // Detalle de servicio
router.get('/ventas', mainController.ventas); // Página de ventas
router.get('/login', mainController.login); // Página de login
router.post('/login', mainController.processLogin);
router.post('/register', mainController.register); // nueva ruta para registro
router.get('/logout', mainController.logout); // cerrar sesión

// Ruta para agregar un producto o servicio desde el formulario de ventas
// Usa el middleware 'upload.single('img')' para recibir la imagen
router.post('/agregar', upload.single('img'), mainController.agregarItem);

// Exporta el router para que pueda ser usado en la app principal
module.exports = router;