require('./confi/confi');
const mongoose = require('mongoose');
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(require('./rutas/usuarios'));
app.use(require('./rutas/login'))
mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true },
    (err, resp) => {
        if (err) throw new err;
        console.log(`Base de datos online`)
    })
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`)
})