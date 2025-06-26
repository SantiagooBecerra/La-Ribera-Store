const express = require('express'); 
const path = require('node:path'); 
const rutasMain = require('./routes/main');
const app = express(); 

app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', rutasMain);

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>  {console.log(`Servidor escuchando en el puerto: http://localhost:${PORT}`);});
