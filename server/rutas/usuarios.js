const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../modelos/usuario');
const usuario = require('../modelos/usuario');
const { vereficacionToken, vereficacionADMIN_ROLE } = require('../middlewares/autenticacion')
const app = express();
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
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                })
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
//Post crear nuevos registros en el servidor 
app.post('/usuario', [vereficacionToken, vereficacionADMIN_ROLE], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        gmail: body.gmail,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    })
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        } else {
            //usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        }
    })
});
//put/patch se utiliza para actualizar registros
app.put('/usuario/:id', [vereficacionToken, vereficacionADMIN_ROLE], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'gmail', 'img', 'role', 'estado']);
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
//delete es para cambiar el estado de algo 
app.delete('/usuario/:id', [vereficacionToken, vereficacionADMIN_ROLE], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
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