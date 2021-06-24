const express = require('express');
const app = express();
app.use(require('./rutas/usuarios'));
app.use(require('./rutas/login'));
app.use(require('./rutas/categorias'));
app.use(require('./rutas/productos'));
app.use(require('./rutas/upload'));
module.exports = app;