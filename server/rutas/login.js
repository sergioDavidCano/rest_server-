const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario');
const app = express();
app.post('/login', (req, res) => {
    let body = req.body
    Usuario.findOne({ gmail: body.gmail }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y contraseña incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEMILLADETOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    })
});

module.exports = app;