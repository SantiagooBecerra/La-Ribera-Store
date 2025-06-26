const path= require('node:path');
const data = require('../models/producto.json');

// const controller= {
//     index: (req, res) => {
//         res.render('index', {
//             title: 'Home',
//             description: 'Inicio',
//         });
//     }
// }

const controller= {
    index: (req, res) => {
        res.render('index', {
            data:data});
    }
}
module.exports = controller;