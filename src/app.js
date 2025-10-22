// Trae la herramienta express para crear el servidor
const express = require('express'); 

// Trae una herramienta para manejar carpetas y archivos
const path = require('node:path'); 

// Trae las rutas que vamos a usar en la web
const rutasMain = require('./routes/main');

// Crea el servidor
const app = express(); 

// Le dice al servidor dónde están las imágenes, estilos y archivos públicos
app.use(express.static(path.join(__dirname, '../public')));

// Le dice al servidor que vamos a usar plantillas EJS para mostrar las páginas
app.set('view engine', 'ejs');

// Le dice dónde están guardadas esas plantillas
app.set('views', path.join(__dirname, 'views'));

// Permite leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Trae la herramienta express-session para manejar sesiones
const session = require('express-session');

// Configura la herramienta express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_por_defecto',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


// Exponer usuario y mensaje (flash simple) a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  res.locals.message = req.session ? req.session.message : null;
  delete req.session?.message;
  next();
});

// Le dice al servidor que use las rutas que definimos
app.use('/', rutasMain);

// Elige el puerto donde va a funcionar la página (3000 si no hay otro)
const PORT = process.env.PORT || 3000

// Prende el servidor y muestra un mensaje para avisar que está funcionando
app.listen(PORT, () =>  {console.log(`Servidor escuchando en el puerto: http://localhost:${PORT}`);});
