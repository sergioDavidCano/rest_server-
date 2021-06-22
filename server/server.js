//Servidor local y sus librerias que implemento en el servidor
require('./confi/confi');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../public')))
app.use(require('./rutas/usuarios'));
app.use(require('./rutas/login'));
app.use(require('./rutas/categorias'));
app.use(require('./rutas/productos'))
mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true },
    (err, resp) => {
        if (err) throw new err;
        console.log(`Base de datos online`)
    })
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`)
})