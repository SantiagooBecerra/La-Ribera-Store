// Importa la herramienta 'path' de Node.js para trabajar con rutas de archivos y carpetas
const path = require ('node:path');

// Importa la herramienta 'fs' para leer y escribir archivos en el disco
const fs = require('fs');

// Importa la lista de productos desde el archivo producto.json
const data = require('../models/producto.json');

// Importa el archivo servicio.json y lo guarda en la constante 'dataa'.
// Así puedes acceder a la lista de servicios desde cualquier parte del controlador.
const dataa = require('../models/servicio.json');

// Define la ruta absoluta al archivo usuarios.json usando path.join y __dirname.
// Esto asegura que siempre se use la ruta correcta, sin importar desde dónde se ejecute el script.
const rutaUsuarios = path.joi7n(__dirname, '../models/usuarios.json');

// Función para leer la lista de usuarios desde el archivo usuarios.json
function leerUsuarios() {
  // Si el archivo no existe, retorna un array vacío (no hay usuarios registrados aún)
  if (!fs.existsSync(rutaUsuarios)) return [];
  // Lee el contenido del archivo como texto (utf-8). Si está vacío, usa '[]' (array vacío)
  const contenido = fs.readFileSync(rutaUsuarios, 'utf-8') || '[]';
  // Intenta convertir el texto a un array de objetos usando JSON.parse
  // Si hay un error (por ejemplo, el archivo está corrupto), retorna un array vacío
  try { return JSON.parse(contenido); } catch { return []; }
};

// Función para guardar la lista de usuarios en el archivo usuarios.json
function guardarUsuarios(usuarios) {
  // Convierte el array de usuarios a texto JSON, con formato bonito (2 espacios de indentación)
  // y lo escribe en el archivo usuarios.json, reemplazando el contenido anterior
  fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 2), 'utf-8');
}

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

        // Si el archivo mensajes.json existe, lo lee y carga loNs mensajes anteriores
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
    },

    // Renderiza la página de login/registro
    login: (req, res) => {
      // Renderiza la vista 'login' 
      res.render('login');
    },

    // Procesa inicio de sesión: valida credenciales y crea sesión
    processLogin: (req, res) => {
      // Extrae email y password enviados desde el formulario
      const { email, password } = req.body;
      // Si falta email o password, muestra error en la vista de login
      if (!email || !password) {
        return res.status(400).render('login', { error: 'Email y contraseña son obligatorios' });
      }

      // Lee la lista de usuarios desde el archivo usuarios.json
      const usuarios = leerUsuarios();
      // Busca un usuario cuyo email coincida (ignorando mayúsculas/minúsculas y espacios)
      const user = usuarios.find(u => String(u.email || '').trim().toLowerCase() === String(email).trim().toLowerCase());

      // Si no existe el usuario o la contraseña no coincide, muestra error
      if (!user || String(user.password || '') !== String(password)) {
        return res.status(401).render('login', { error: 'Credenciales inválidas' });
      }

      // Si existe la sesión, guarda los datos del usuario en la sesión y un mensaje de bienvenida
      if (req.session) {
        req.session.user = { id: user.id, nombre: user.nombre, email: user.email };
        req.session.message = `Se inició sesión correctamente. Bienvenido ${user.nombre}`;
      }

      // Redirige al usuario a la página principal
      return res.redirect('/');
    },

    // Registra un nuevo usuario, agrega id y guarda en usuarios.json
    register: (req, res) => {
        try {
            // Extrae nombre, email y password del formulario
            const { nombre, email, password } = req.body;
            // Si falta algún campo, muestra error en la vista de login
            if (!nombre || !email || !password) {
                return res.status(400).render('login', { error: 'Todos los campos son obligatorios' });
            }

            // Lee los usuarios existentes
            const usuarios = leerUsuarios();
            // Limpia el email para comparar correctamente
            const emailClean = String(email).trim().toLowerCase();

            // Si ya existe un usuario con ese email, muestra error
            if (usuarios.find(u => String(u.email || '').trim().toLowerCase() === emailClean)) {
                return res.status(409).render('login', { error: 'El email ya está registrado' });
            }

            // Genera un nuevo id para el usuario
            const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id || 0)) + 1 : 1;
            // Agrega el nuevo usuario al array
            usuarios.push({ id: newId, nombre: String(nombre).trim(), email: emailClean, password: String(password) });

            // Guarda el array actualizado en el archivo usuarios.json
            guardarUsuarios(usuarios);

            // Después de registrar, inicia sesión automáticamente y muestra mensaje de bienvenida
            req.session.user = { id: newId, nombre: nombre.trim(), email: emailClean };
            req.session.message = 'Registro exitoso. Bienvenido!';
            // Redirige a la página principal
            res.redirect('/');
        } catch (err) {
            // Si ocurre un error, lo muestra en consola y muestra error en la vista de login
            console.error('Error register:', err);
            return res.status(500).render('login', { error: 'Ocurrió un error al registrar' });
        }
    },

    // Cierra la sesión del usuario
    logout: (req, res) => {
      // Si existe la sesión, la destruye (cierra sesión)
      if (req.session) {
        req.session.destroy(err => {
          // Después de cerrar sesión, redirige a la página principal
          return res.redirect('/');
        });
      } else {
        // Si no hay sesión, simplemente redirige a la página principal
        return res.redirect('/');
      }
    },
};

// Exporta el objeto 'controller' para que pueda ser usado en otros archivos del proyecto
module.exports = controller;