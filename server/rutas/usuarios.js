const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const Usuario = require('../modelos/usuario');
const usuario = require('../modelos/usuario');
const { vereficacionToken, vereficacionADMIN_ROLE } = require('../middlewares/autenticacion')
const app = express();
//Busqueda que puedo implementar en la base de datos
app.get('/usuario', vereficacionToken, (req, res) => {
    let id = req.params.id;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);
    usuario.find({ estado: true }, 'nombre gmail role estado google img ')
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            //Vereficacion si el token es invalido
            if (err) {
                return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Token no valido'
                        }
                    })
                    //Cuenta cuantos usuarios ahi en la base de datos 
            } else {
                usuario.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })
                })
            }
        })
});
//Post crear un usuario en de datos
app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        gmail: body.gmail,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    })
    usuario.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //verefica si el token es valido
        res.json({
            ok: true,
            usuario
        })
    })
});
//put/patch se utiliza para actualizar registros
app.put('/usuario/id', vereficacionToken, (req, res) => {
    let id = req.params.id;
    //Busca en la base de datos
    let body = _.pick(req.body, ['nombre', 'gmail', 'img', 'role', 'estado']);
    //Busca y actualiza los datos del usuario en la base de datos
    usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
});
//delete es para cambiar el estado del usuario en la base de datos
app.delete('/usuario/:id', vereficacionToken, (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Cambia el estado de activo a desactivado en la base e datos
    usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
});
module.exports = app;